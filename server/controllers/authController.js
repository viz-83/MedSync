const User = require('../models/User');
const Doctor = require('../models/doctorModel');
const sendEmail = require('../utils/email');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { StreamChat } = require('stream-chat');
const RefreshToken = require('../models/RefreshToken');

const streamClient = new StreamChat(process.env.STREAM_API_KEY, process.env.STREAM_API_SECRET);

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const signToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: '15m' // Short lived access token
    });
};

const createSendToken = async (user, statusCode, res, isDoctorProfileComplete = false) => {
    const token = signToken(user._id, user.role);

    // Generate Refresh Token
    const refreshToken = crypto.randomBytes(40).toString('hex');
    const refreshTokenExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    // Save Refresh Token to DB
    await RefreshToken.create({
        user: user._id,
        token: refreshToken,
        expiresAt: refreshTokenExpires
    });

    const cookieOptions = {
        expires: new Date(Date.now() + 15 * 60 * 1000), // Match access token
        httpOnly: true,
        secure: false, // Set to true in prod
        sameSite: 'lax'
    };

    const refreshCookieOptions = {
        expires: refreshTokenExpires,
        httpOnly: true,
        secure: false, // Set to true in prod
        sameSite: 'lax',
        path: '/api/auth/refresh-token' // Restrict path
    };

    // Send Cookies
    res.cookie('token', token, cookieOptions); // Access token in cookie (legacy/fallback)
    res.cookie('refreshToken', refreshToken, refreshCookieOptions);

    // Remove sensitive data from output
    user.password = undefined;
    user.otp = undefined;

    res.status(statusCode).json({
        status: 'success',
        token,
        user,
        isDoctorProfileComplete,
        data: { user } // keeping data.user just in case some other new code expects it, but flat is primary
    });
};

exports.signup = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const otp = generateOTP();
        const otpExpires = Date.now() + 10 * 60 * 1000; // 10 mins

        user = new User({
            name,
            email,
            password: hashedPassword,
            role,
            otp,
            otpExpires
        });

        await user.save();

        // Sync user to Stream
        try {
            await streamClient.upsertUser({
                id: user._id.toString(),
                name: user.name,
                role: user.role === 'admin' ? 'admin' : 'user'
            });
        } catch (streamError) {
            console.error('Stream Sync Error (Signup):', streamError);
            // Don't fail signup if stream sync fails, but log it
        }

        try {
            await sendEmail({
                email,
                subject: 'Your OTP Code',
                message: `Your OTP code is ${otp}`
            });
        } catch (emailError) {
            console.error('Email Send Error:', emailError);

            try {
                await User.deleteOne({ _id: user._id });
            } catch (delError) {
                // ignore
            }

            return res.status(500).json({ message: 'Failed to send OTP email. Please check your email address or try again later.' });
        }

        res.status(201).json({ message: 'User registered. Please verify OTP.' });
    } catch (error) {
        console.error('Signup Error:', error);
        res.status(500).json({ message: error.message });
    }
};

exports.verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(400).json({ message: 'User not found' });
        if (user.isVerified) return res.status(400).json({ message: 'User already verified' });
        if (user.otp !== otp || user.otpExpires < Date.now()) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        user.isVerified = true;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        let isDoctorProfileComplete = false;
        if (user.role === 'doctor') {
            const doctor = await Doctor.findOne({ user: user._id });
            if (doctor) isDoctorProfileComplete = true;
        }

        createSendToken(user, 200, res, isDoctorProfileComplete);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(400).json({ message: 'Invalid credentials' });
        if (!user.isVerified) return res.status(400).json({ message: 'Please verify your email first' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        // Sync user to Stream on login
        try {
            await streamClient.upsertUser({
                id: user._id.toString(),
                name: user.name,
                role: user.role === 'admin' ? 'admin' : 'user'
            });
        } catch (streamError) {
            console.error('Stream Sync Error (Login):', streamError);
        }

        let isDoctorProfileComplete = false;
        if (user.role === 'doctor') {
            const doctor = await Doctor.findOne({ user: user._id });
            if (doctor) isDoctorProfileComplete = true;
        }

        createSendToken(user, 200, res, isDoctorProfileComplete);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.status(401).json({ message: 'No refresh token provided' });
        }

        const tokenDoc = await RefreshToken.findOne({ token: refreshToken });
        if (!tokenDoc || tokenDoc.isExpired || tokenDoc.revoked) {
            // If token invalid/revoked, clear cookies and force logout
            res.clearCookie('token');
            res.clearCookie('refreshToken', { path: '/api/auth/refresh-token' });
            return res.status(403).json({ message: 'Invalid or expired refresh token' });
        }

        // Get user
        const user = await User.findById(tokenDoc.user);
        if (!user) {
            return res.status(401).json({ message: 'User belonging to token no longer exists' });
        }

        // Rotate Token (Revoke old, create new)
        tokenDoc.revoked = Date.now();
        tokenDoc.replacedByToken = 'new_generated_in_createSendToken'; // Placeholder, actual rotation happens in createSendToken logic? 
        // Actually createSendToken creates a BRAND NEW record. We just mark old one as revoked.
        await tokenDoc.save();

        let isDoctorProfileComplete = false;
        if (user.role === 'doctor') {
            const doctor = await Doctor.findOne({ user: user._id });
            if (doctor) isDoctorProfileComplete = true;
        }

        // Issue new tokens
        createSendToken(user, 200, res, isDoctorProfileComplete);

    } catch (error) {
        console.error('Refresh Token Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ _id: { $ne: req.body.userId } }).select('-password -otp -otpExpires');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.protect = async (req, res, next) => {
    try {
        let token;

        console.log('--- Protect Middleware Debug ---');
        console.log('Headers:', req.headers);
        console.log('Cookies:', req.cookies);

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        } else if (req.cookies.token) {
            token = req.cookies.token;
        }

        if (!token) {
            console.log('No token found!');
            return res.status(401).json({ message: 'You are not logged in! Please log in to get access.' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded Token:', decoded);

        const currentUser = await User.findById(decoded.id);
        if (!currentUser) {
            console.log('User not found for token');
            return res.status(401).json({ message: 'The user belonging to this token no longer does exist.' });
        }

        req.user = currentUser;
        next();
    } catch (error) {
        console.error('Protect Middleware Error:', error);
        res.status(401).json({ message: 'Invalid token. Please log in again.' });
    }
};

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        // roles ['admin', 'doctor']. role='user'
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'You do not have permission to perform this action' });
        }
        next();
    };
};


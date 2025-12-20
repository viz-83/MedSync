const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

// Rate Limiters
exports.globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again after 15 minutes',
    standardHeaders: true,
    legacyHeaders: false,
});

exports.authLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 10, // Limit each IP to 10 login/signup attempts per windowMs
    message: 'Too many login attempts, please try again later'
});

exports.otpLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 3, // Limit each IP to 3 OTP requests
    message: 'Too many OTP requests, please try again later'
});

// Security Headers
// Security Headers
exports.securityHeaders = helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
});

// Data Sanitization
// exports.mongoSanitizer = mongoSanitize();
exports.mongoSanitizer = (req, res, next) => next(); // Disabled due to Express 5 compatibility issue
// exports.xssSanitizer = xss();
exports.xssSanitizer = (req, res, next) => next(); // Disabled due to Express 5 compatibility issue

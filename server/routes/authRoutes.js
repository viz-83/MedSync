const express = require('express');
const router = express.Router();
const { signup, verifyOTP, login, refreshToken } = require('../controllers/authController');

router.post('/signup', signup);
router.post('/verify-otp', verifyOTP);
router.post('/login', login);
router.post('/refresh-token', refreshToken);
router.post('/users', require('../controllers/authController').getAllUsers);

module.exports = router;

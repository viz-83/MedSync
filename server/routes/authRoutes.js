const express = require('express');
const router = express.Router();
const { signup, verifyOTP, login, refreshToken } = require('../controllers/authController');

const { validate, schemas } = require('../utils/validationSchemas');

router.post('/signup', validate(schemas.signup), signup);
router.post('/verify-otp', verifyOTP);
router.post('/login', validate(schemas.login), login);
router.post('/refresh-token', refreshToken);
router.post('/logout', require('../controllers/authController').logout);
router.post('/users', require('../controllers/authController').getAllUsers);

module.exports = router;

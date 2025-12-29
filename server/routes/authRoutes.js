const express = require('express');
const router = express.Router();
const { signup, login, refreshToken } = require('../controllers/authController');

const { validate, schemas } = require('../utils/validationSchemas');

router.post('/signup', validate(schemas.signup), signup);
router.post('/signup', validate(schemas.signup), signup);
router.post('/login', validate(schemas.login), login);
router.post('/refresh-token', refreshToken);
router.post('/logout', require('../controllers/authController').logout);
// Secure: Only admin can list users
router.post('/users', require('../controllers/authController').protect, require('../controllers/authController').restrictTo('admin'), require('../controllers/authController').getAllUsers);

module.exports = router;

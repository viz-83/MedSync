const express = require('express');
const aiAssistantController = require('../controllers/aiAssistantController');
// const authController = require('../controllers/authController'); // Optional: protect if needed

const router = express.Router();

router.post('/message', aiAssistantController.handleMessage);

module.exports = router;

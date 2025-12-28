const express = require('express');
const healthMetricController = require('../controllers/healthMetricController');
const authController = require('../controllers/authController');
const { validate, schemas } = require('../utils/validationSchemas');

const router = express.Router();

router.use(authController.protect);

// My Metrics (Patient)
router.post('/', validate(schemas.metric), authController.restrictTo('user', 'patient'), healthMetricController.logHealthMetric);
router.get('/my', healthMetricController.getMyHealthMetrics);

// AI Insights
router.post('/insights', authController.restrictTo('user', 'patient'), healthMetricController.getAIHealthInsights);

// Patient Metrics (Doctor)
router.get('/patient/:patientId', authController.restrictTo('doctor', 'admin'), healthMetricController.getPatientHealthMetrics);

module.exports = router;

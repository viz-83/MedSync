const HealthMetric = require('../models/healthMetricModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// Threshold helpers
const checkAbnormal = (type, value) => {
    switch (type) {
        case 'GLUCOSE':
            // < 70 (Hypoglycemia) or > 180 (Hyperglycemia)
            return value < 70 || value > 180;
        case 'BLOOD_PRESSURE':
            // Systolic > 140 or Diastolic > 90
            return value.systolic > 140 || value.diastolic > 90;
        case 'HEART_RATE':
            // < 50 or > 110 (Resting rate generic bounds)
            return value < 50 || value > 110;
        // WEIGHT: Trend based, hard to flag single value as abnormal without context
        default:
            return false;
    }
};

exports.logHealthMetric = catchAsync(async (req, res, next) => {
    const { metricType, value, note } = req.body;

    if (!metricType || !value) {
        return next(new AppError('Please provide metric type and value', 400));
    }

    // Basic structure validation for BP
    if (metricType === 'BLOOD_PRESSURE') {
        if (!value.systolic || !value.diastolic) {
            return next(new AppError('Blood pressure requires systolic and diastolic values', 400));
        }
    }

    const metric = await HealthMetric.create({
        patient: req.user._id,
        metricType,
        value,
        note
    });

    const isAbnormal = checkAbnormal(metricType, value);

    res.status(201).json({
        status: 'success',
        data: {
            metric: {
                ...metric.toObject(),
                isAbnormal
            }
        }
    });
});

exports.getMyHealthMetrics = catchAsync(async (req, res, next) => {
    // Optional filters
    const { metricType, fromDate, toDate } = req.query;

    let filter = { patient: req.user._id };

    if (metricType) {
        filter.metricType = metricType.toUpperCase();
    }

    if (fromDate || toDate) {
        filter.recordedAt = {};
        if (fromDate) filter.recordedAt.$gte = new Date(fromDate);
        if (toDate) filter.recordedAt.$lte = new Date(toDate);
    }

    const metrics = await HealthMetric.find(filter).sort('recordedAt'); // Sort ASC for charts

    // Add isAbnormal flag to each
    const metricsWithFlags = metrics.map(m => ({
        ...m.toObject(),
        isAbnormal: checkAbnormal(m.metricType, m.value)
    }));

    // Group by type if no specific type requested
    let responseData = metricsWithFlags;
    if (!metricType) {
        responseData = metricsWithFlags.reduce((acc, curr) => {
            if (!acc[curr.metricType]) acc[curr.metricType] = [];
            acc[curr.metricType].push(curr);
            return acc;
        }, {});
    }

    res.status(200).json({
        status: 'success',
        results: metrics.length,
        data: {
            metrics: responseData
        }
    });
});

exports.getPatientHealthMetrics = catchAsync(async (req, res, next) => {
    const { patientId } = req.params;

    const metrics = await HealthMetric.find({ patient: patientId }).sort('recordedAt');

    const metricsWithFlags = metrics.map(m => ({
        ...m.toObject(),
        isAbnormal: checkAbnormal(m.metricType, m.value)
    }));

    const grouped = metricsWithFlags.reduce((acc, curr) => {
        if (!acc[curr.metricType]) acc[curr.metricType] = [];
        acc[curr.metricType].push(curr);
        return acc;
    }, {});

    res.status(200).json({
        status: 'success',
        data: {
            metrics: grouped
        }
    });
});

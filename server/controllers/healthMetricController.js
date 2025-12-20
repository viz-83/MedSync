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

const { encrypt, decrypt } = require('../utils/encryption');

// Helper to safely parse if needed or return value
const parseDecrypted = (val) => {
    try {
        return JSON.parse(val);
    } catch (e) {
        return val;
    }
}

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

    // Encrypt sensitive data
    const encryptedValue = encrypt(JSON.stringify(value));
    const encryptedNote = note ? encrypt(note) : undefined;

    const metric = await HealthMetric.create({
        patient: req.user._id,
        metricType,
        value: encryptedValue,
        note: encryptedNote
    });

    const isAbnormal = checkAbnormal(metricType, value); // Use original raw value for check

    res.status(201).json({
        status: 'success',
        data: {
            metric: {
                ...metric.toObject(),
                value: value, // Return raw input to user
                note: note,   // Return raw input
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

    // Decrypt and Add isAbnormal flag
    const metricsWithFlags = metrics.map(m => {
        const decryptedVal = parseDecrypted(decrypt(m.value));
        const decryptedNote = m.note ? decrypt(m.note) : undefined;
        return {
            ...m.toObject(),
            value: decryptedVal,
            note: decryptedNote,
            isAbnormal: checkAbnormal(m.metricType, decryptedVal)
        };
    });

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

    const metricsWithFlags = metrics.map(m => {
        const decryptedVal = parseDecrypted(decrypt(m.value));
        const decryptedNote = m.note ? decrypt(m.note) : undefined;
        return {
            ...m.toObject(),
            value: decryptedVal,
            note: decryptedNote,
            isAbnormal: checkAbnormal(m.metricType, decryptedVal)
        };
    });

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

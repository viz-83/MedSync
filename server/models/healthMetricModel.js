const mongoose = require('mongoose');

const healthMetricSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Metric must belong to a patient']
    },
    metricType: {
        type: String,
        enum: ['GLUCOSE', 'BLOOD_PRESSURE', 'WEIGHT', 'HEART_RATE'],
        required: [true, 'Please specify metric type']
    },
    value: {
        type: mongoose.Schema.Types.Mixed, // Number or Object { systolic, diastolic }
        required: [true, 'Please provide a value']
    },
    recordedAt: {
        type: Date,
        default: Date.now
    },
    note: {
        type: String,
        trim: true
    }
});

// Index for faster queries on patient history
healthMetricSchema.index({ patient: 1, metricType: 1, recordedAt: -1 });

const HealthMetric = mongoose.model('HealthMetric', healthMetricSchema);

module.exports = HealthMetric;

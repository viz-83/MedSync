const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false // Allow system overrides or unauthenticated logs (e.g. failed login)
    },
    action: {
        type: String,
        required: true
    },
    resourceType: {
        type: String,
        enum: ['User', 'Patient', 'Doctor', 'Appointment', 'Prescription', 'Report', 'Payment', 'System'],
        required: true
    },
    resourceId: {
        type: mongoose.Schema.Types.ObjectId,
        required: false
    },
    details: {
        type: Object,
        required: false
    },
    ipAddress: String,
    userAgent: String,
    status: {
        type: String,
        enum: ['SUCCESS', 'FAILURE', 'WARNING'],
        default: 'SUCCESS'
    }
}, { timestamps: { createdAt: true, updatedAt: false } }); // Only need createdAt

module.exports = mongoose.model('AuditLog', auditLogSchema);

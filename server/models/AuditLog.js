const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false // Can be null for failed login attempts (unknown user)
    },
    action: {
        type: String, // e.g., 'LOGIN', 'LOGOUT', 'VIEW_RECORD', 'CREATE_PRESCRIPTION'
        required: true
    },
    resourceType: {
        type: String, // e.g., 'Appointment', 'Prescription'
        required: false
    },
    resourceId: {
        type: String,
        required: false
    },
    details: {
        type: Object, // Flexible storage for metadata
        required: false
    },
    ipAddress: {
        type: String,
        select: false // Hide by default
    },
    userAgent: {
        type: String,
        select: false
    }
}, { timestamps: true });

// TTL Index: Auto-delete logs after 90 days to save space
auditLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 });

module.exports = mongoose.model('AuditLog', auditLogSchema);

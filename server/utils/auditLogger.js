const logger = require('./logger');
const AuditLog = require('../models/AuditLog');

const logAudit = async (req, auditData) => {
    try {
        const { user, action, resourceType, resourceId, details, status } = auditData;

        // Extract IP and User Agent safely
        const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        const userAgent = req.headers['user-agent'];

        await AuditLog.create({
            user: user ? user._id : null,
            action,
            resourceType,
            resourceId,
            details: { ...details, status },
            ipAddress,
            userAgent
        });

    } catch (error) {
        logger.error('Audit Log Error', { error: error.message });
        // Don't crash application if logging fails
    }
};

module.exports = logAudit;

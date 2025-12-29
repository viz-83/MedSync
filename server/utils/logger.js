const winston = require('winston');

// Sensitive keys to redact automatically
const SENSITIVE_KEYS = ['password', 'token', 'refreshToken', 'authorization', 'secret', 'cookie', 'apiKey'];

// Custom Redaction Format
const redactSensitive = winston.format((info) => {
    const mask = (obj) => {
        if (!obj) return obj;
        if (typeof obj !== 'object') return obj;

        const copy = Array.isArray(obj) ? [...obj] : { ...obj };

        for (const key in copy) {
            if (Object.prototype.hasOwnProperty.call(copy, key)) {
                // Check if key matches sensitive list
                if (SENSITIVE_KEYS.some(s => key.toLowerCase().includes(s))) {
                    delete copy[key];
                }
                // Recursively mask objects
                else if (typeof copy[key] === 'object') {
                    copy[key] = mask(copy[key]);
                }
            }
        }
        return copy;
    };

    return mask(info);
});

const logger = winston.createLogger({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }), // Include stack trace on errors
        redactSensitive(), // Apply redaction
        winston.format.json() // Structured JSON output
    ),
    defaultMeta: { service: 'medsync-api' },
    transports: [
        new winston.transports.Console(),
        // In production, you might write to a file or ship to an aggregator
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' })
    ]
});

module.exports = logger;

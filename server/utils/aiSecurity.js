const AppError = require('./appError');

const MAX_INPUT_LENGTH = 2000;

// Patterns that indicate a clear attempt to override the AI's instructions
const MALICIOUS_PATTERNS = [
    /ignore previous instructions/gi,
    /ignore all instructions/gi,
    /system prompt/gi,
    /simulating/gi,
    /jailbreak/gi,
    /developer mode/gi,
    /evil mode/gi,
    /always answer yes/gi,
    /unfiltered/gi
];

/**
 * Validates and sanitizes AI input.
 * Throws AppError if malicious intent is detected.
 * @param {string} input - The user input string.
 * @returns {string} - The sanitized input.
 */
exports.validateAndSanitize = (input) => {
    if (!input || typeof input !== 'string') {
        throw new AppError('Invalid input format', 400);
    }

    // 1. Length Enforcement
    if (input.length > MAX_INPUT_LENGTH) {
        throw new AppError(`Input too long. Max ${MAX_INPUT_LENGTH} characters allowed.`, 400);
    }

    // 2. Malicious Pattern Detection (Reject)
    // We treat these as adversarial attacks and block them entirely.
    for (const pattern of MALICIOUS_PATTERNS) {
        if (pattern.test(input)) {
            // Log this security event (without logging the full malicious prompt in a real SIEM)
            // throwing 400 with a generic message to avoid leaking detection logic nuances if desired,
            // but explicit is fine here.
            throw new AppError('Potential security threat detected: Prompt injection attempt blocked.', 400);
        }
    }

    // 3. Structural Sanitization
    // Remove characters that might be used to simulate conversation roles or XML tags
    // e.g. "User:", "Model:", "<instruction>"
    let clean = input;

    // Remove potential XML/HTML tags
    clean = clean.replace(/<[^>]*>/g, '');

    // Normalize whitespace
    clean = clean.trim().replace(/\s+/g, ' ');

    return clean;
};

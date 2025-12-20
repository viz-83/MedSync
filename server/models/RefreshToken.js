const mongoose = require('mongoose');

const refreshTokenSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    token: {
        type: String,
        required: true
    },
    expiresAt: {
        type: Date,
        required: true
    },
    revoked: {
        type: Date,
        default: null
    },
    replacedByToken: {
        type: String,
        default: null
    }
}, { timestamps: true });

refreshTokenSchema.virtual('isExpired').get(function () {
    return Date.now() >= this.expiresAt;
});

refreshTokenSchema.virtual('isActive').get(function () {
    return !this.revoked && !this.isExpired;
});

module.exports = mongoose.model('RefreshToken', refreshTokenSchema);

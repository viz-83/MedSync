const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    orderType: {
        type: String,
        enum: ['MEDICINE', 'LAB_TEST'],
        required: true
    },
    relatedOrderId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'orderRefModel'
    },
    // Dynamic ref based on orderType could be handled manually or via virtuals, 
    // but for simplicity we store the ID and handle lookups in controllers.

    razorpayOrderId: {
        type: String,
        required: true
    },
    razorpayPaymentId: {
        type: String
    },
    razorpaySignature: {
        type: String
    },
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        default: 'INR'
    },
    status: {
        type: String,
        enum: ['CREATED', 'SUCCESS', 'FAILED'],
        default: 'CREATED'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Payment', paymentSchema);

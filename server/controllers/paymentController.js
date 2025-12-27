const Razorpay = require('razorpay');
const crypto = require('crypto');
const Payment = require('../models/paymentModel');
const MedicineOrder = require('../models/medicineOrderModel');
const DiagnosticOrder = require('../models/diagnosticOrderModel');
const AppError = require('../utils/appError');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Debug: Check if keys are loaded (Don't expose secrets in prod logs, but check existence)
if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    console.error("FATAL: Razorpay Keys are missing in environment variables!");
}

exports.createPaymentOrder = async (req, res, next) => {
    try {
        if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
            return next(new AppError('Razorpay API Keys are missing on server. Please check .env', 500));
        }

        const { orderType, orderId } = req.body;
        console.log(`[Payment] Create Order Request: Type=${orderType}, ID=${orderId}, User=${req.user.id}`);

        if (!orderType || !orderId) {
            return next(new AppError('Please provide orderType and orderId', 400));
        }

        let order;
        let amount = 0;

        // 1. Fetch Order & Calculate Amount
        if (orderType === 'MEDICINE') {
            order = await MedicineOrder.findById(orderId);
            if (!order) return next(new AppError('Medicine Order not found', 404));
            // Ensure order belongs to user (Handle populated object or direct ID)
            const orderUserId = order.patient._id ? order.patient._id.toString() : order.patient.toString();
            if (orderUserId !== req.user.id) {
                return next(new AppError('Not authorized to pay for this order', 403));
            }
            amount = order.totalAmount;
        } else if (orderType === 'LAB_TEST') {
            order = await DiagnosticOrder.findById(orderId);
            if (!order) return next(new AppError('Lab Test Order not found', 404));
            const orderUserId = order.patient._id ? order.patient._id.toString() : order.patient.toString();
            if (orderUserId !== req.user.id) {
                return next(new AppError('Not authorized to pay for this order', 403));
            }
            amount = order.totalAmount;
        } else {
            return next(new AppError('Invalid order type', 400));
        }

        // 2. Check for existing successful payment (Optional but recommended)
        const existingPayment = await Payment.findOne({
            relatedOrderId: orderId,
            status: 'SUCCESS'
        });

        if (existingPayment) {
            return next(new AppError('Order is already paid', 400));
        }

        // 3. Create Razorpay Order
        const options = {
            amount: amount * 100, // Amount in paise
            currency: "INR",
            receipt: `receipt_${orderType}_${orderId.toString().substring(0, 10)}`,
            payment_capture: 1 // Auto capture
        };

        const razorpayOrder = await razorpay.orders.create(options);

        // 4. Create Payment Record (Pending)
        await Payment.create({
            user: req.user.id,
            orderType,
            relatedOrderId: orderId,
            razorpayOrderId: razorpayOrder.id,
            amount,
            status: 'CREATED'
        });

        res.status(200).json({
            status: 'success',
            data: {
                razorpayOrderId: razorpayOrder.id,
                amount: amount * 100,
                currency: "INR",
                keyId: process.env.RAZORPAY_KEY_ID
            }
        });

    } catch (error) {
        console.error('Razorpay Create Order Error:', error);
        // Provide more detail if it's a Razorpay specific error
        if (error.error && error.error.description) {
            return next(new AppError(`Razorpay Error: ${error.error.description}`, 500));
        }
        next(new AppError(`Failed to create payment order: ${error.message}`, 500));
    }
};

exports.verifyPayment = async (req, res, next) => {
    try {
        const {
            razorpayOrderId,
            razorpayPaymentId,
            razorpaySignature,
            orderType,
            orderId
        } = req.body;

        const body = razorpayOrderId + "|" + razorpayPaymentId;

        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest('hex');

        const isAuthentic = expectedSignature === razorpaySignature;

        if (isAuthentic) {
            // 1. Update Payment Status
            await Payment.findOneAndUpdate(
                { razorpayOrderId },
                {
                    razorpayPaymentId,
                    razorpaySignature,
                    status: 'SUCCESS'
                }
            );

            // 2. Update Order Status
            if (orderType === 'MEDICINE') {
                await MedicineOrder.findByIdAndUpdate(orderId, {
                    status: 'VERIFIED', // Or 'PLACED' if you prefer 'VERIFIED' only after admin check. But usually payment success = verified order.
                    $push: {
                        statusHistory: {
                            status: 'VERIFIED',
                            note: 'Payment Successful via Razorpay',
                            changedAt: Date.now()
                        }
                    }
                });
            } else if (orderType === 'LAB_TEST') {
                // Logic for Lab Test - maybe just keep as BOOKED but add payment info note if schema supported it.
                // Or if we had a paymentStatus field.
                // For now, we assume 'BOOKED' is confirmed.
                // Optionally could add a note or flag.
                // Since Diagnostic schema doesn't have statusHistory, we just leave it as BOOKED.
            }

            res.status(200).json({
                status: 'success',
                message: 'Payment verified successfully'
            });

        } else {
            // Payment Failed or Tampered
            await Payment.findOneAndUpdate(
                { razorpayOrderId },
                {
                    status: 'FAILED'
                }
            );

            return next(new AppError('Payment verification failed', 400));
        }

    } catch (error) {
        console.error('Payment Verification Error:', error);
        next(new AppError('Internal Server Error during verification', 500));
    }
};

/**
 * Utility to handle Razorpay Checkout
 */

const loadRazorpayScript = () => {
    return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => {
            resolve(true);
        };
        script.onerror = () => {
            resolve(false);
        };
        document.body.appendChild(script);
    });
};

export const openRazorpayCheckout = async ({
    razorpayOrderId,
    amount,
    currency,
    keyId,
    userDetails, // { name, email, contact }
    onSuccess, // ({ razorpay_payment_id, razorpay_order_id, razorpay_signature }) => {}
    onFailure // (error) => {}
}) => {
    const res = await loadRazorpayScript();

    if (!res) {
        alert('Razorpay SDK failed to load. Are you online?');
        if (onFailure) onFailure({ message: 'SDK Failed to load' });
        return;
    }

    const options = {
        key: keyId, // Enter the Key ID generated from the Dashboard
        amount: amount.toString(),
        currency: currency,
        name: "MedSync Healthcare",
        description: "Medical Services Transaction",
        // image: "/logo.png", // Add logo if available in public folder
        order_id: razorpayOrderId,
        handler: function (response) {
            if (onSuccess) {
                onSuccess({
                    razorpayOrderId: response.razorpay_order_id,
                    razorpayPaymentId: response.razorpay_payment_id,
                    razorpaySignature: response.razorpay_signature
                });
            }
        },
        prefill: {
            name: userDetails?.name || '',
            email: userDetails?.email || '',
            contact: userDetails?.mobile || ''
        },
        notes: {
            address: "MedSync Online Pharmacy"
        },
        theme: {
            color: "#4A7C59" // MedSync Primary Green
        }
    };

    const paymentObject = new window.Razorpay(options);

    paymentObject.on('payment.failed', function (response) {
        console.error('Payment Failed:', response.error);
        if (onFailure) onFailure(response.error);
    });

    paymentObject.open();
};

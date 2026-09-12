const crypto = require("crypto");

// Generate Razorpay payment signature
const generatePaymentSignature = (
    orderId,
    paymentId,
    secret
) => {
    return crypto
        .createHmac("sha256", secret)
        .update(`${orderId}|${paymentId}`)
        .digest("hex");
};

// Verify Razorpay payment signature
const verifyPaymentSignature = (
    orderId,
    paymentId,
    signature,
    secret
) => {
    const generatedSignature = generatePaymentSignature(
        orderId,
        paymentId,
        secret
    );

    return generatedSignature === signature;
};

// Convert amount to smallest currency unit
// Razorpay expects INR amount in paise
const convertToPaise = (amount) => {
    return Math.round(Number(amount) * 100);
};

// Convert paise back to INR
const convertFromPaise = (amount) => {
    return Number(amount) / 100;
};

module.exports = {
    generatePaymentSignature,
    verifyPaymentSignature,
    convertToPaise,
    convertFromPaise
};
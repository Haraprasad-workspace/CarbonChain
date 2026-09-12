const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
    {
        wasteBatch: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "WasteBatch",
            required: true
        },

        negotiation: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Negotiation",
            required: true
        },

        generator: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        facility: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Facility",
            required: true
        },

        amount: {
            type: Number,
            required: true,
            min: 0
        },

        currency: {
            type: String,
            default: "INR"
        },

        paymentMethod: {
            type: String,
            enum: ["RAZORPAY", "DEMO"],
            default: "RAZORPAY"
        },

        razorpayOrderId: {
            type: String,
            trim: true
        },

        razorpayPaymentId: {
            type: String,
            trim: true
        },

        razorpaySignature: {
            type: String,
            trim: true
        },

        status: {
            type: String,
            enum: [
                "PENDING",
                "PROCESSING",
                "SUCCESS",
                "FAILED",
                "CANCELLED",
                "REFUNDED"
            ],
            default: "PENDING"
        },

        paidAt: {
            type: Date
        },

        failureReason: {
            type: String,
            trim: true
        }
    },
    {
        timestamps: true
    }
);

paymentSchema.index({ negotiation: 1 }, { unique: true });

module.exports = mongoose.model("Payment", paymentSchema);
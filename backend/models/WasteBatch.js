const mongoose = require("mongoose");

const wasteBatchSchema = new mongoose.Schema(
    {
        generator: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        wasteType: {
            type: String,
            required: true,
            trim: true
        },

        quantity: {
            value: {
                type: Number,
                required: true,
                min: 0
            },
            unit: {
                type: String,
                enum: ["KG", "TON"],
                default: "TON"
            }
        },

        quality: {
            type: String,
            trim: true
        },

        location: {
            address: String,
            city: String,
            state: String,
            pincode: String,
            latitude: Number,
            longitude: Number
        },

        availabilityDate: {
            type: Date,
            required: true
        },

        pricingType: {
            type: String,
            enum: [
                "SELL",
                "FREE_PICKUP",
                "PAY_FOR_TREATMENT",
                "NEGOTIABLE"
            ],
            required: true
        },

        askingPrice: {
            type: Number,
            min: 0
        },

        description: {
            type: String,
            trim: true
        },

        status: {
            type: String,
            enum: [
                "REGISTERED",
                "MATCHED",
                "NEGOTIATED",
                "COLLECTED",
                "IN_TRANSIT",
                "RECEIVED",
                "PROCESSED",
                "CANCELLED"
            ],
            default: "REGISTERED"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("WasteBatch", wasteBatchSchema);
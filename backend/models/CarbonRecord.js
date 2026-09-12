const mongoose = require("mongoose");

const carbonRecordSchema = new mongoose.Schema(
    {
        wasteBatch: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "WasteBatch",
            required: true,
            unique: true
        },

        facility: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Facility",
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
                required: true
            }
        },

        processingMethod: {
            type: String,
            enum: [
                "BIOCHAR",
                "BIOGAS",
                "COMPOSTING",
                "RECYCLING",
                "WASTE_TO_ENERGY"
            ],
            required: true
        },

        carbonFactor: {
            type: Number,
            required: true,
            min: 0
        },

        co2eAvoided: {
            type: Number,
            required: true,
            min: 0
        },

        calculationBasis: {
            type: String,
            trim: true
        },

        processedAt: {
            type: Date,
            default: Date.now
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("CarbonRecord", carbonRecordSchema);
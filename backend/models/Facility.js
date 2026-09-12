const mongoose = require("mongoose");

const facilitySchema = new mongoose.Schema(
    {
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        facilityName: {
            type: String,
            required: true,
            trim: true
        },

        facilityType: {
            type: String,
            enum: [
                "BIOCHAR",
                "BIOGAS",
                "COMPOSTING",
                "RECYCLING",
                "WASTE_TO_ENERGY",
                "OTHER"
            ],
            required: true
        },

        acceptedWasteTypes: [{
            type: String,
            trim: true
        }],

        processingCapacity: {
            value: {
                type: Number,
                required: true,
                min: 0
            },
            unit: {
                type: String,
                enum: ["KG_PER_DAY", "TON_PER_DAY"],
                default: "TON_PER_DAY"
            }
        },

        location: {
            address: String,
            city: String,
            state: String,
            pincode: String,
            latitude: {
                type: Number,
                required: true
            },
            longitude: {
                type: Number,
                required: true
            }
        },

        pricing: {
            type: String,
            enum: [
                "BUY_WASTE",
                "FREE_TREATMENT",
                "CHARGE_TREATMENT",
                "NEGOTIABLE"
            ],
            required: true
        },

        pricePerUnit: {
            type: Number,
            min: 0
        },

        description: {
            type: String,
            trim: true
        },

        operationalStatus: {
            type: String,
            enum: [
                "ACTIVE",
                "FULL",
                "TEMPORARILY_CLOSED",
                "INACTIVE"
            ],
            default: "ACTIVE"
        },

        verificationStatus: {
            type: String,
            enum: [
                "PENDING",
                "VERIFIED",
                "REJECTED"
            ],
            default: "PENDING"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Facility", facilitySchema);
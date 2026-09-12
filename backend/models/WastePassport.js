const mongoose = require("mongoose");

const wastePassportSchema = new mongoose.Schema(
    {
        wasteBatch: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "WasteBatch",
            required: true,
            unique: true
        },

        generator: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        facility: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Facility"
        },

        negotiation: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Negotiation"
        },

        shipment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Shipment"
        },

        carbonRecord: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "CarbonRecord"
        },

        passportId: {
            type: String,
            required: true,
            unique: true,
            trim: true
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

        lifecycleStatus: {
            type: String,
            enum: [
                "REGISTERED",
                "MATCHED",
                "NEGOTIATED",
                "PAID",
                "COLLECTED",
                "IN_TRANSIT",
                "RECEIVED",
                "PROCESSED"
            ],
            default: "REGISTERED"
        },

        origin: {
            address: String,
            city: String,
            state: String,
            pincode: String,
            latitude: Number,
            longitude: Number
        },

        destination: {
            address: String,
            city: String,
            state: String,
            pincode: String,
            latitude: Number,
            longitude: Number
        },

        processingMethod: {
            type: String,
            enum: [
                "BIOCHAR",
                "BIOGAS",
                "COMPOSTING",
                "RECYCLING",
                "WASTE_TO_ENERGY"
            ]
        },

        carbonImpact: {
            co2eAvoided: {
                type: Number,
                min: 0
            },
            carbonFactor: {
                type: Number,
                min: 0
            }
        },

        events: [
            {
                status: {
                    type: String,
                    required: true
                },
                description: {
                    type: String,
                    trim: true
                },
                timestamp: {
                    type: Date,
                    default: Date.now
                }
            }
        ]
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "WastePassport",
    wastePassportSchema
);
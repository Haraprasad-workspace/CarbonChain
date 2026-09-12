const mongoose = require("mongoose");

const offerSchema = new mongoose.Schema(
    {
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        amount: {
            type: Number,
            required: true,
            min: 0
        },

        message: {
            type: String,
            trim: true
        },

        status: {
            type: String,
            enum: [
                "PENDING",
                "ACCEPTED",
                "REJECTED",
                "COUNTERED"
            ],
            default: "PENDING"
        }
    },
    {
        timestamps: true
    }
);

const negotiationSchema = new mongoose.Schema(
    {
        wasteBatch: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "WasteBatch",
            required: true
        },

        facility: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Facility",
            required: true
        },

        generator: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        currentOffer: {
            type: Number,
            required: true,
            min: 0
        },

        offers: [offerSchema],

        status: {
            type: String,
            enum: [
                "ACTIVE",
                "ACCEPTED",
                "REJECTED",
                "CANCELLED",
                "EXPIRED"
            ],
            default: "ACTIVE"
        },

        agreedPrice: {
            type: Number,
            min: 0
        },

        agreedAt: {
            type: Date
        }
    },
    {
        timestamps: true
    }
);

// One negotiation per waste batch + facility
negotiationSchema.index(
    {
        wasteBatch: 1,
        facility: 1
    },
    {
        unique: true
    }
);

module.exports = mongoose.model(
    "Negotiation",
    negotiationSchema
);
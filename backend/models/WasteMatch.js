const mongoose = require("mongoose");

const wasteMatchSchema = new mongoose.Schema(
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

        matchScore: {
            type: Number,
            required: true,
            min: 0,
            max: 100
        },

        distance: {
            type: Number,
            required: true,
            min: 0
        },

        status: {
            type: String,
            enum: [
                "SUGGESTED",
                "ACCEPTED",
                "REJECTED",
                "NEGOTIATING",
                "COMPLETED"
            ],
            default: "SUGGESTED"
        }
    },
    {
        timestamps: true
    }
);

// Prevent duplicate waste-facility matches
wasteMatchSchema.index(
    {
        wasteBatch: 1,
        facility: 1
    },
    {
        unique: true
    }
);

module.exports = mongoose.model(
    "WasteMatch",
    wasteMatchSchema
);
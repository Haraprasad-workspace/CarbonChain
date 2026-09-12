const mongoose = require("mongoose");

const shipmentSchema = new mongoose.Schema(
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

        logisticsProvider: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },

        vehicleNumber: {
            type: String,
            trim: true,
            uppercase: true
        },

        driverName: {
            type: String,
            trim: true
        },

        driverPhone: {
            type: String,
            trim: true
        },

        pickupLocation: {
            address: String,
            city: String,
            state: String,
            pincode: String,
            latitude: Number,
            longitude: Number
        },

        deliveryLocation: {
            address: String,
            city: String,
            state: String,
            pincode: String,
            latitude: Number,
            longitude: Number
        },

        route: {
            distance: Number,
            estimatedTime: Number
        },

        status: {
            type: String,
            enum: [
                "CREATED",
                "ASSIGNED",
                "PICKUP_SCHEDULED",
                "PICKED_UP",
                "IN_TRANSIT",
                "DELIVERED",
                "CANCELLED"
            ],
            default: "CREATED"
        },

        pickupDate: Date,
        deliveredDate: Date
    },
    { timestamps: true }
);

module.exports = mongoose.model("Shipment", shipmentSchema);
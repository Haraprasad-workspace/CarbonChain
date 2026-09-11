const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        password: {
            type: String,
            required: true
        },

        phone: {
            type: String,
            required: true
        },

        role: {
            type: String,
            enum: [
                "WASTE_GENERATOR",
                "FACILITY",
                "LOGISTICS_PROVIDER",
                "MUNICIPALITY",
                "ADMIN"
            ],
            required: true
        },

        organization: {
            type: String,
            trim: true
        },

        location: {
            address: String,
            city: String,
            state: String,
            pincode: String
        },

        aadhaarVerification: {
            status: {
                type: String,
                enum: ["PENDING", "VERIFIED", "REJECTED"],
                default: "PENDING"
            }
        },

        gstVerification: {
            gstin: {
                type: String,
                trim: true,
                uppercase: true
            },

            status: {
                type: String,
                enum: ["NOT_REQUIRED", "PENDING", "VERIFIED", "REJECTED"],
                default: "NOT_REQUIRED"
            }
        },

        accountStatus: {
            type: String,
            enum: ["PENDING", "ACTIVE", "SUSPENDED"],
            default: "PENDING"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("User", userSchema);
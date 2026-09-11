const User = require("../models/User");

// Verify Aadhaar
const verifyAadhaar = async (req, res) => {
    try {
        const { aadhaarNumber } = req.body;

        if (!aadhaarNumber || aadhaarNumber.length !== 12) {
            return res.status(400).json({
                message: "Invalid Aadhaar number"
            });
        }

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // Simulated verification
        user.aadhaarVerification.status = "VERIFIED";

        await user.save();

        res.status(200).json({
            message: "Aadhaar verified successfully",
            status: user.aadhaarVerification.status
        });

    } catch (error) {
        res.status(500).json({
            message: "Aadhaar verification failed",
            error: error.message
        });
    }
};


// Verify GST
const verifyGST = async (req, res) => {
    try {
        const { gstin } = req.body;

        if (!gstin) {
            return res.status(400).json({
                message: "GSTIN is required"
            });
        }

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // Simulated verification
        user.gstVerification.gstin = gstin;
        user.gstVerification.status = "VERIFIED";

        await user.save();

        res.status(200).json({
            message: "GST verified successfully",
            status: user.gstVerification.status
        });

    } catch (error) {
        res.status(500).json({
            message: "GST verification failed",
            error: error.message
        });
    }
};


// Get Verification Status
const getVerificationStatus = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .select("aadhaarVerification gstVerification");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            aadhaar: user.aadhaarVerification,
            gst: user.gstVerification
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch verification status",
            error: error.message
        });
    }
};


module.exports = {
    verifyAadhaar,
    verifyGST,
    getVerificationStatus
};
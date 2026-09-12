const bcrypt = require("bcrypt");
const User = require("../models/User");

// Get Profile
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            user
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch profile",
            error: error.message
        });
    }
};


// Update Profile
const updateProfile = async (req, res) => {
    try {
        const { name, phone, organization, location } = req.body;

        const user = await User.findByIdAndUpdate(
            req.user.id,
            {
                name,
                phone,
                organization,
                location
            },
            {
                new: true,
                runValidators: true
            }
        ).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            message: "Profile updated successfully",
            user
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to update profile",
            error: error.message
        });
    }
};


// Change Password
const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const isMatch = await bcrypt.compare(
            currentPassword,
            user.password
        );

        if (!isMatch) {
            return res.status(401).json({
                message: "Current password is incorrect"
            });
        }

        user.password = await bcrypt.hash(newPassword, 10);

        await user.save();

        res.status(200).json({
            message: "Password changed successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to change password",
            error: error.message
        });
    }
};

// Get Active Logistics Providers
const getLogisticsProviders = async (req, res) => {
    try {
        const providers = await User.find({
            role: "LOGISTICS_PROVIDER",
            accountStatus: "ACTIVE"
        }).select("-password");

        res.status(200).json({
            providers
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch logistics providers",
            error: error.message
        });
    }
};
module.exports = {
    getProfile,
    updateProfile,
    changePassword,
    getLogisticsProviders
};
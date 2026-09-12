const express = require("express");

const {
    getProfile,
    updateProfile,
    changePassword,
    getLogisticsProviders
} = require("../controllers/userController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/profile", authMiddleware, getProfile);

router.put("/profile", authMiddleware, updateProfile);

router.put("/change-password", authMiddleware, changePassword);

// Get active logistics providers
router.get("/logistics-providers", authMiddleware, getLogisticsProviders);

module.exports = router;
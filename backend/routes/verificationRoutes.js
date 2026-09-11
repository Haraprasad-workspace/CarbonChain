const express = require("express");

const {
    verifyAadhaar,
    verifyGST,
    getVerificationStatus
} = require("../controllers/verificationController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/aadhaar", authMiddleware, verifyAadhaar);
router.post("/gst", authMiddleware, verifyGST);
router.get("/status", authMiddleware, getVerificationStatus);

module.exports = router;

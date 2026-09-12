const express = require("express");

const {
    createNegotiation,
    getGeneratorNegotiations,
    getFacilityNegotiations,
    getNegotiation,
    submitOffer,
    acceptOffer,
    rejectOffer
} = require("../controllers/negotiationController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

router.use(authMiddleware);

// ==================== CREATE NEGOTIATION ====================

router.post(
    "/",
    roleMiddleware("WASTE_GENERATOR"),
    createNegotiation
);

// ==================== GET NEGOTIATIONS ====================

// Generator negotiations
router.get(
    "/generator",
    roleMiddleware("WASTE_GENERATOR"),
    getGeneratorNegotiations
);

// Facility negotiations
router.get(
    "/facility",
    roleMiddleware("FACILITY"),
    getFacilityNegotiations
);

// ==================== SINGLE NEGOTIATION ====================

router.get(
    "/:id",
    roleMiddleware("WASTE_GENERATOR", "FACILITY"),
    getNegotiation
);

// ==================== OFFERS ====================

// Submit offer / counter offer
router.post(
    "/:id/offer",
    roleMiddleware("WASTE_GENERATOR", "FACILITY"),
    submitOffer
);

// Accept current offer
router.put(
    "/:id/accept",
    roleMiddleware("WASTE_GENERATOR", "FACILITY"),
    acceptOffer
);

// Reject current offer
router.put(
    "/:id/reject",
    roleMiddleware("WASTE_GENERATOR", "FACILITY"),
    rejectOffer
);

module.exports = router;
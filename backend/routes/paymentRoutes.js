const express = require("express");

const {
    createPayment,
    getMyPayments,
    getPayment,
    verifyPayment,
    cancelPayment
} = require("../controllers/paymentController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

router.use(authMiddleware);

// Generator creates payment after accepted negotiation
router.post(
    "/",
    roleMiddleware("WASTE_GENERATOR"),
    createPayment
);

// Generator / Facility / Admin payment history
router.get(
    "/my",
    roleMiddleware("WASTE_GENERATOR", "FACILITY", "ADMIN"),
    getMyPayments
);

// Single payment
router.get(
    "/:id",
    roleMiddleware("WASTE_GENERATOR", "FACILITY", "ADMIN"),
    getPayment
);

// Generator verifies payment
router.post(
    "/:id/verify",
    roleMiddleware("WASTE_GENERATOR"),
    verifyPayment
);

// Generator cancels pending payment
router.put(
    "/:id/cancel",
    roleMiddleware("WASTE_GENERATOR"),
    cancelPayment
);

module.exports = router;
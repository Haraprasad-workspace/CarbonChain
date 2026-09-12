const express = require("express");

const {
    createShipment,
    getMyShipments,
    getShipment,
    assignLogisticsProvider,
    updateShipmentStatus
} = require("../controllers/shipmentController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

router.use(authMiddleware);


// ============================================================
// CREATE SHIPMENT
// ============================================================
// Only waste generator can create shipment after negotiation

router.post(
    "/",
    roleMiddleware("WASTE_GENERATOR"),
    createShipment
);


// ============================================================
// GET MY SHIPMENTS
// ============================================================
// Generator -> own shipments
// Facility -> incoming shipments
// Logistics Provider -> assigned shipments
// Admin -> all shipments

router.get(
    "/my",
    roleMiddleware(
        "WASTE_GENERATOR",
        "FACILITY",
        "LOGISTICS_PROVIDER",
        "ADMIN"
    ),
    getMyShipments
);


// ============================================================
// GET SINGLE SHIPMENT
// ============================================================

router.get(
    "/:id",
    roleMiddleware(
        "WASTE_GENERATOR",
        "FACILITY",
        "LOGISTICS_PROVIDER",
        "MUNICIPALITY",
        "ADMIN"
    ),
    getShipment
);


// ============================================================
// ASSIGN LOGISTICS PROVIDER
// ============================================================
// Generator / Facility / Admin

router.put(
    "/:id/assign",
    roleMiddleware(
        "WASTE_GENERATOR",
        "FACILITY",
        "ADMIN"
    ),
    assignLogisticsProvider
);


// ============================================================
// UPDATE SHIPMENT STATUS
// ============================================================
// Logistics provider / Admin

router.put(
    "/:id/status",
    roleMiddleware(
        "LOGISTICS_PROVIDER",
        "ADMIN"
    ),
    updateShipmentStatus
);


module.exports = router;
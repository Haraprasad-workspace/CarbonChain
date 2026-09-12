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

// Generator creates shipment after successful negotiation
router.post(
    "/",
    roleMiddleware("WASTE_GENERATOR"),
    createShipment
);

// Generator / Logistics provider views their shipments
router.get(
    "/my",
    roleMiddleware("WASTE_GENERATOR", "LOGISTICS_PROVIDER"),
    getMyShipments
);

// View a specific shipment
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

// Assign logistics provider
router.put(
    "/:id/assign",
    roleMiddleware("WASTE_GENERATOR", "FACILITY", "ADMIN"),
    assignLogisticsProvider
);

// Update shipment status
router.put(
    "/:id/status",
    roleMiddleware("LOGISTICS_PROVIDER", "ADMIN"),
    updateShipmentStatus
);

module.exports = router;
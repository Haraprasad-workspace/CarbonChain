const express = require("express");

const {
    createWastePassport,
    getPassportByWaste,
    getMyPassports,
    syncShipmentTracking,
    syncCarbonRecord
} = require("../controllers/trackingController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

router.use(authMiddleware);

// Create digital waste passport
router.post(
    "/passports",
    roleMiddleware("WASTE_GENERATOR"),
    createWastePassport
);

// Get current user's passports
router.get(
    "/passports/my",
    roleMiddleware("WASTE_GENERATOR", "FACILITY", "ADMIN"),
    getMyPassports
);

// Get passport for a specific waste batch
router.get(
    "/passports/waste/:wasteBatchId",
    roleMiddleware("WASTE_GENERATOR", "FACILITY", "ADMIN"),
    getPassportByWaste
);

// Sync shipment status with waste passport
router.post(
    "/shipment/:shipmentId/sync",
    roleMiddleware(
        "WASTE_GENERATOR",
        "FACILITY",
        "LOGISTICS_PROVIDER",
        "ADMIN"
    ),
    syncShipmentTracking
);

// Add carbon information to passport
router.post(
    "/carbon/:wasteBatchId/sync",
    roleMiddleware("FACILITY", "ADMIN"),
    syncCarbonRecord
);

module.exports = router;
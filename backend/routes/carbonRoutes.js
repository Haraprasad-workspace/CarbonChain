const express = require("express");

const {
    createCarbonRecord,
    getCarbonRecord,
    getMyCarbonRecords,
    getFacilityCarbonRecords,
    getCarbonSummary
} = require("../controllers/carbonController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

router.use(authMiddleware);

// Facility records carbon impact after processing
router.post(
    "/",
    roleMiddleware("FACILITY"),
    createCarbonRecord
);

// Generator's carbon records
router.get(
    "/my",
    roleMiddleware("WASTE_GENERATOR"),
    getMyCarbonRecords
);

// Facility's carbon records
router.get(
    "/facility",
    roleMiddleware("FACILITY"),
    getFacilityCarbonRecords
);

// Overall platform carbon summary
router.get(
    "/summary",
    roleMiddleware(
        "WASTE_GENERATOR",
        "FACILITY",
        "MUNICIPALITY",
        "ADMIN"
    ),
    getCarbonSummary
);

// Individual carbon record
router.get(
    "/:id",
    roleMiddleware(
        "WASTE_GENERATOR",
        "FACILITY",
        "MUNICIPALITY",
        "ADMIN"
    ),
    getCarbonRecord
);

module.exports = router;
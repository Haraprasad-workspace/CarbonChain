const express = require("express");

const {
    createFacility,
    getMyFacilities,
    getFacility,
    updateFacility,
    deleteFacility,
    getActiveFacilities
} = require("../controllers/facilityController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

router.use(authMiddleware);

// Facility owner routes
router.post(
    "/",
    roleMiddleware("FACILITY"),
    createFacility
);
// Used later by matching system
router.get(
    "/active/all",
    roleMiddleware(
        "WASTE_GENERATOR",
        "FACILITY",
        "MUNICIPALITY",
        "ADMIN"
    ),
    getActiveFacilities
);

router.get(
    "/my",
    roleMiddleware("FACILITY"),
    getMyFacilities
);

router.get(
    "/:id",
    roleMiddleware("FACILITY"),
    getFacility
);

router.put(
    "/:id",
    roleMiddleware("FACILITY"),
    updateFacility
);

router.delete(
    "/:id",
    roleMiddleware("FACILITY"),
    deleteFacility
);



module.exports = router;
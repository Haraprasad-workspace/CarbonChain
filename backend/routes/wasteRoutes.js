const express = require("express");

const {
    createWasteBatch,
    getMyWasteBatches,
    getWasteBatch,
    updateWasteBatch,
    cancelWasteBatch,
    getReceivedWasteBatches
} = require("../controllers/wasteController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

router.use(authMiddleware);

// Generator routes
router.post(
    "/",
    roleMiddleware("WASTE_GENERATOR"),
    createWasteBatch
);

router.get(
    "/my",
    roleMiddleware("WASTE_GENERATOR"),
    getMyWasteBatches
);
// Facility route
router.get(
    "/received",
    roleMiddleware("FACILITY"),
    getReceivedWasteBatches
);

router.get(
    "/:id",
    roleMiddleware("WASTE_GENERATOR"),
    getWasteBatch
);

router.put(
    "/:id",
    roleMiddleware("WASTE_GENERATOR"),
    updateWasteBatch
);

router.delete(
    "/:id",
    roleMiddleware("WASTE_GENERATOR"),
    cancelWasteBatch
);



module.exports = router;
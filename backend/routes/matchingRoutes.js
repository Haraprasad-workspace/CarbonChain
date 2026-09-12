const express = require("express");

const {
    findMatches,
    getWasteMatches,
    acceptMatch,
    rejectMatch
} = require("../controllers/matchingController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

router.use(authMiddleware);

// Find matching facilities
router.get(
    "/waste/:wasteId",
    roleMiddleware("WASTE_GENERATOR"),
    findMatches
);

// Get existing matches
router.get(
    "/waste/:wasteId/all",
    roleMiddleware("WASTE_GENERATOR"),
    getWasteMatches
);

// Accept a match
router.put(
    "/:matchId/accept",
    roleMiddleware("WASTE_GENERATOR"),
    acceptMatch
);

// Reject a match
router.put(
    "/:matchId/reject",
    roleMiddleware("WASTE_GENERATOR"),
    rejectMatch
);

module.exports = router;
const express = require("express");

const {
    createWasteBatch,
    getMyWasteBatches,
    getWasteBatch,
    updateWasteBatch,
    cancelWasteBatch
} = require("../controllers/wasteController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

router.use(authMiddleware);
router.use(roleMiddleware("WASTE_GENERATOR"));

router.post("/", createWasteBatch);
router.get("/my", getMyWasteBatches);
router.get("/:id", getWasteBatch);
router.put("/:id", updateWasteBatch);
router.delete("/:id", cancelWasteBatch);

module.exports = router;
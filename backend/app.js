const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./configuration/mongoose_configuration");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ==================== DATABASE ====================

connectDB();

// ==================== MIDDLEWARE ====================

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==================== ROUTES ====================

// Authentication
app.use("/api/auth", require("./routes/authRoutes"));

// User Profile
app.use("/api/users", require("./routes/userRoutes"));

// Aadhaar & GST Verification
app.use(
    "/api/verification",
    require("./routes/verificationRoutes")
);

// Waste Management
app.use("/api/waste", require("./routes/wasteRoutes"));

// ==================== HEALTH CHECK ====================

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "CarbonChain API is running"
    });
});

// ==================== 404 HANDLER ====================

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});

// ==================== GLOBAL ERROR HANDLER ====================

app.use((err, req, res, next) => {
    console.error("Server Error:", err);

    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error"
    });
});

// ==================== START SERVER ====================

app.listen(PORT, () => {
    console.log(`CarbonChain server running on port ${PORT}`);
});

module.exports = app;
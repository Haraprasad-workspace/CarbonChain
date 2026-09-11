const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./configuration/mongoose_configuration");

dotenv.config();

const app = express();

// Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/verification", require("./routes/verificationRoutes"));

// Health Check
app.get("/", (req, res) => {
    res.status(200).json({
        message: "CarbonChain API is running"
    });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);

    res.status(500).json({
        message: "Internal Server Error"
    });
});

module.exports = app;
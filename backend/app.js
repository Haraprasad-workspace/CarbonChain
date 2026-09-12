const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");

const connectDB = require("./configuration/mongoose_configuration");

const setupNegotiationSocket = require("./sockets/negotiationSocket");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ==================== DATABASE ====================

connectDB();

// ==================== HTTP SERVER ====================

const server = http.createServer(app);

// ==================== SOCKET.IO ====================

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"]
    }
});

setupNegotiationSocket(io);

// ==================== MIDDLEWARE ====================

app.use(cors());

app.use(express.json());

app.use(
    express.urlencoded({
        extended: true
    })
);

// ==================== ROUTES ====================

// Authentication
app.use(
    "/api/auth",
    require("./routes/authRoutes")
);

// User Profile
app.use(
    "/api/users",
    require("./routes/userRoutes")
);

// Aadhaar & GST Verification
app.use(
    "/api/verification",
    require("./routes/verificationRoutes")
);

// Waste Management
app.use(
    "/api/waste",
    require("./routes/wasteRoutes")
);

// Facility Management
app.use(
    "/api/facilities",
    require("./routes/facilityRoutes")
);

// Waste-Facility Matching
app.use(
    "/api/matching",
    require("./routes/matchingRoutes")
);

// Negotiation & Offers
app.use(
    "/api/negotiations",
    require("./routes/negotiationRoutes")
);
app.use("/api/shipments", require("./routes/shipmentRoutes"));
app.use("/api/carbon", require("./routes/carbonRoutes"));
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

server.listen(PORT, () => {
    console.log(
        `CarbonChain server running on port ${PORT}`
    );
});

// ==================== EXPORT ====================

module.exports = app;
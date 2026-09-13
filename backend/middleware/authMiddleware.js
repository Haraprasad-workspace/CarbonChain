const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Authentication required"
            });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // Make both id formats available
        req.user = {
            ...decoded,
            id: decoded.id || decoded._id,
            _id: decoded._id || decoded.id
        };

        console.log("\n========== AUTH DEBUG ==========");
        console.log("User ID:", req.user.id);
        console.log("User _id:", req.user._id);
        console.log("User Role:", req.user.role);
        console.log("================================\n");

        next();

    } catch (error) {

        console.error("Authentication error:", error.message);

        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
};

module.exports = authMiddleware;
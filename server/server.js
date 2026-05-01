const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// Load env BEFORE any modules that depend on process.env
dotenv.config();

const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");

if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not configured");
}

if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
}

// Initialize app
const app = express();
app.set("trust proxy", 1);

// Connect Database
connectDB();

const allowedOrigins = (process.env.CLIENT_ORIGIN || process.env.FRONTEND_URL || process.env.CLIENT_URL || "http://localhost:5173,http://localhost:5174")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: "Too many auth attempts, please try again later" }
});

// Middleware
app.use(helmet({
    crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
}));
app.use(cors({
    origin(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
            return;
        }

        callback(new Error("Not allowed by CORS"));
    },
    credentials: true
}));
app.use(express.json({ limit: "10kb" }));
app.use("/api/auth", authLimiter, authRoutes);

// Health check route (professional touch)
app.get("/", (req, res) => {
    res.status(200).json({
        status: "success",
        message: "API is running"
    });
});

// Global error handler (basic setup)
app.use((err, req, res, next) => {
    res.status(500).json({
        status: "error",
        message: err.message || "Internal Server Error"
    });
});

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
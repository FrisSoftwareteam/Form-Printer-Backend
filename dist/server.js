import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import mongoSanitize from "express-mongo-sanitize";
import { connectDB } from "./config/database.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { rateLimiter } from "./middleware/rateLimiter.js";
import authRoutes from "./routes/authRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import dataRoutes from "./routes/dataRoutes.js";
// Load environment variables
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
// Connect to MongoDB
connectDB();
// Security middleware
app.use(helmet());
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS?.split(",") || "*",
    credentials: true,
}));
app.use(mongoSanitize());
// Body parser middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
// Rate limiting
app.use(rateLimiter);
// Health check
app.get("/health", (req, res) => {
    res.json({ status: "OK", timestamp: new Date().toISOString() });
});
// Routes
app.use("/api/auth", authRoutes);
app.use("/api", uploadRoutes);
app.use("/api", dataRoutes);
// Error handler (must be last)
app.use(errorHandler);
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV || "development"} mode`);
});

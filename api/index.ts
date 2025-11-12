import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import mongoSanitize from "express-mongo-sanitize";
import { connectDB } from "../src/config/database.js";
import { errorHandler } from "../src/middleware/errorHandler.js";
import { rateLimiter } from "../src/middleware/rateLimiter.js";
import authRoutes from "../src/routes/authRoutes.js";
// import uploadRoutes from "../src/routes/uploadRoutes.js";
import dataRoutes from "../src/routes/dataRoutes.js";

dotenv.config();

const app = express();

connectDB();

app.use(helmet());
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(",") || "*",
    credentials: true,
  })
);
app.use(mongoSanitize());

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use(rateLimiter);

app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

app.use("/api/auth", authRoutes);
// app.use("/api", uploadRoutes);
app.use("/api", dataRoutes);

app.use(errorHandler);

export default app;

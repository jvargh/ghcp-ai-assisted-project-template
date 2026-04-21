import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { errorHandler } from "./middleware/errorHandler.js";
import authRoutes from "./routes/auth.js";
import surveyRoutes from "./routes/surveys.js";
import responseRoutes from "./routes/responses.js";

const app = express();

// Security headers
app.use(helmet());

// CORS
const CORS_ORIGIN = process.env["CORS_ORIGIN"] ?? "http://localhost:5173";
app.use(cors({ origin: CORS_ORIGIN, credentials: true }));

// Body parsing
app.use(express.json({ limit: "10kb" }));

// Rate limiting on auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: {
    error: {
      code: "RATE_LIMITED",
      message: "Too many requests, please try again later",
    },
  },
});

// Routes
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/surveys", surveyRoutes);
app.use("/api/surveys/:id/responses", responseRoutes);

// Error handling
app.use(errorHandler);

export default app;

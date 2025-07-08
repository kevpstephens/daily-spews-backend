import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import compression from "compression";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import {
  handleCustomErrors,
  handleServerErrors,
  handlePSQLErrors,
} from "./errors/errorHandlers.js";
import apiRouter from "./app/routes/api.routes.js";
import logger from "./utils/logger.js";

const app = express();

//! =========================================
//! COMPRESSION MIDDLEWARE
//! =========================================
app.use(compression());

//! =========================================
//! SECURITY MIDDLEWARE
//! =========================================
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  }),
);

//! =========================================
//! CORS MIDDLEWARE
//! =========================================
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://daily-spews.onrender.com",
      "https://daily-spews-preview.onrender.com",
    ],
    credentials: true,
  }),
);

//! =========================================
//! REQUEST LOGGING MIDDLEWARE
//! =========================================
app.use((req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    const { statusCode: status } = res;
    const { method, url } = req;

    let statusColor = "🟢";
    if (status >= 400) statusColor = "🔴";
    else if (status >= 300) statusColor = "🟡";

    logger.info(`${statusColor} ${method} ${url} - ${status} (${duration}ms)`);
  });

  next();
});

//! =========================================
//! REQUEST PARSING MIDDLEWARE
//! =========================================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//! =========================================
//! STATIC FILES MIDDLEWARE
//! =========================================
app.use("/images", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173"); // Add explicit CORS headers for images
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Vary", "Origin");
  next();
});

app.use(express.static("public"));

//! =========================================
//! RATE LIMITING MIDDLEWARE
//! =========================================
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === "development" ? 10000 : 150,
  message: { msg: "Too many requests, please try again later." },
  skip: () => process.env.NODE_ENV === "development", // Skip entirely in development
});

//! =========================================
//! HEALTH CHECK MIDDLEWARE
//! =========================================
app.get("/health", (req, res) => {
  res.status(200).json({ status: "healthy" });
});

//! =========================================
//! RATE LIMITING MIDDLEWARE
//! =========================================
app.use("/api", limiter);

//! =========================================
//! API ROUTES MIDDLEWARE
//! =========================================
app.use("/api", apiRouter);

//! =========================================
//! 404 HANDLER MIDDLEWARE
//! =========================================
app.use((req, res) => {
  res.status(404).send({ msg: "Path not found!" });
});

//! =========================================
//! ERROR HANDLING MIDDLEWARE
//! =========================================
app.use(handleCustomErrors);
app.use(handlePSQLErrors);
app.use(handleServerErrors);

export default app;

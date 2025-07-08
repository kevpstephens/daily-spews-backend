const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");

const app = express();

// ~~~~~~~~~~~~~~~ COMPRESSIONMIDDLEWARE ~~~~~~~~~~~~~~~
app.use(compression());

// ~~~~~~~~~~~~~~~ SECURITY MIDDLEWARE ~~~~~~~~~~~~~~~
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  }),
);

// ~~~~~~~~~~~~~~~ ERROR HANDLERS ~~~~~~~~~~~~~~~
const {
  handleCustomErrors,
  handleServerErrors,
  handlePSQLErrors,
} = require("./errors/errorHandlers");

// ~~~~~~~~~~~~~~~ ROUTERS ~~~~~~~~~~~~~~~
const apiRouter = require("./app/routes/api.routes");

// ~~~~~~~~~~~~~~~ CORS ~~~~~~~~~~~~~~~
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

// ~~~~~~~~~~~~~~~ REQUEST LOGGING ~~~~~~~~~~~~~~~
app.use((req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    const { statusCode: status } = res;
    const { method, url } = req;

    // Color code by status
    let statusColor = "🟢";
    if (status >= 400) statusColor = "🔴";
    else if (status >= 300) statusColor = "🟡";

    console.log(`${statusColor} ${method} ${url} - ${status} (${duration}ms)`);
  });

  next();
});

// ~~~~~~~~~~~~~~~ REQUEST PARSING ~~~~~~~~~~~~~~~
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ~~~~~~~~~~~~~~~ STATIC FILES ~~~~~~~~~~~~~~~
app.use("/images", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173"); // Add explicit CORS headers for images
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Vary", "Origin");
  next();
});

app.use(express.static("public"));

// ~~~~~~~~~~~~~~~ RATE LIMITING ~~~~~~~~~~~~~~~
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === "development" ? 10000 : 150,
  message: { msg: "Too many requests, please try again later." },
  skip: () => process.env.NODE_ENV === "development", // Skip entirely in development
});

// ~~~~~~~~~~~~~~~ HEALTH CHECK ~~~~~~~~~~~~~~~
app.use("/api", limiter);

// ~~~~~~~~~~~~~~~ HEALTH CHECK ~~~~~~~~~~~~~~~
app.get("/health", (req, res) => {
  res.status(200).json({ status: "healthy" });
});

// ~~~~~~~~~~~~~~~ API ROUTES ~~~~~~~~~~~~~~~
app.use("/api", apiRouter);

// ~~~~~~~~~~~~~~~ 404 HANDLER ~~~~~~~~~~~~~~~
app.use((req, res) => {
  res.status(404).send({ msg: "Path not found!" });
});

// ~~~~~~~~~~~~~~~ ERROR HANDLING ~~~~~~~~~~~~~~~
app.use(handleCustomErrors);
app.use(handlePSQLErrors);
app.use(handleServerErrors);

module.exports = app;

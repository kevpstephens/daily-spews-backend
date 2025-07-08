// ~~~~~~~~~~~~~~~ CORE MODULES ~~~~~~~~~~~~~~~
const express = require("express");
const helmet = require("helmet");
const compression = require("compression");
const rateLimit = require("express-rate-limit");

const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const logger = require("./utils/logger");

// ~~~~~~~~~~~~~~~ ENVIRONMENT DETECTION ~~~~~~~~~~~~~~~
const isDevelopment = process.env.NODE_ENV === "development";

// ~~~~~~~~~~~~~~~ ERROR HANDLERS ~~~~~~~~~~~~~~~
const {
  handleCustomErrors,
  handleServerErrors,
  handlePSQLErrors,
} = require("./errors/errorHandlers");

// ~~~~~~~~~~~~~~~ ROUTERS ~~~~~~~~~~~~~~~
const apiRouter = require("./app/routes/api.routes");

// ~~~~~~~~~~~~~~~ SECURITY MIDDLEWARE ~~~~~~~~~~~~~~~
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        imgSrc: [
          "'self'",
          "data:", // Allow data URLs for inline images
          "blob:", // Allow blob URLs for dynamic images
          "https:", // Allow all HTTPS images
          "https://daily-spews-api.onrender.com",
          "https://*.supabase.co",
        ],
        connectSrc: ["'self'", "https://daily-spews.onrender.com"],
      },
    },
    crossOriginEmbedderPolicy: false, // For Supabase compatibility
  }),
);

// ~~~~~~~~~~~~~~~ PERFORMANCE MIDDLEWARE ~~~~~~~~~~~~~~~
app.use(compression());

// ~~~~~~~~~~~~~~~ STATIC FILES ~~~~~~~~~~~~~~~
app.use(express.static("public")); // Serve static files from the 'public' directory

// ~~~~~~~~~~~~~~~ CORS CONFIGURATION ~~~~~~~~~~~~~~~
app.use(
  cors({
    origin: (origin, callback) => {
      const allowlist = [
        "http://localhost:5173",
        "https://daily-spews.onrender.com",
        "https://daily-spews-preview.onrender.com",
      ];
      if (!origin || allowlist.includes(origin)) {
        callback(null, true);
      } else {
        logger.error("Blocked by CORS:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // allow cookies
  }),
);

// ~~~~~~~~~~~~~~~ RATE LIMITING ~~~~~~~~~~~~~~~
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 150, // limit each IP to 150 requests per windowMs
  message: { msg: "Too many requests, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

// ~~~~~~~~~~~~~~~ REQUEST PARSING ~~~~~~~~~~~~~~~
app.use(
  express.json({
    limit: "10mb",
    verify: (req, res, buf) => {
      try {
        JSON.parse(buf);
      } catch (e) {
        res.status(400).send({ msg: "Invalid JSON format" });
      }
    },
  }),
);
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// ~~~~~~~~~~~~~~~ REQUEST LOGGING ~~~~~~~~~~~~~~~
const requestLogger = (req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    logger.info("Request completed", {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
      userAgent: req.get("User-Agent"),
      ip: req.ip,
    });
  });

  next();
};

app.use(requestLogger);

// ~~~~~~~~~~~~~~~ DEVELOPMENT MIDDLEWARE ~~~~~~~~~~~~~~~
if (isDevelopment) {
  app.use((req, res, next) => {
    logger.debug("Development request details", {
      headers: req.headers,
      body: req.body,
      query: req.query,
    });
    next();
  });
}

// ~~~~~~~~~~~~~~~ HEALTH CHECK ~~~~~~~~~~~~~~~
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    version: process.env.npm_package_version || "1.0.0",
  });
});

// ~~~~~~~~~~~~~~~ API ROUTER ~~~~~~~~~~~~~~~
app.use("/api", limiter, apiRouter);

// ~~~~~~~~~~~~~~~ CATCH-ALL ~~~~~~~~~~~~~~~
app.use((req, res) => {
  res.status(404).send({ msg: "Path not found!" });
});

// ~~~~~~~~~~~~~~~ ERROR HANDLING ~~~~~~~~~~~~~~~
app.use(handleCustomErrors);
app.use(handlePSQLErrors);
app.use(handleServerErrors);

module.exports = app;

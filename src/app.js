// ~~~~~~~~~~~~~~~ CORE MODULES ~~~~~~~~~~~~~~~
const express = require("express");

const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const logger = require("./utils/logger");

// ~~~~~~~~~~~~~~~ ERROR HANDLERS ~~~~~~~~~~~~~~~
const {
  handleCustomErrors,
  handleServerErrors,
  handlePSQLErrors,
} = require("./errors/errorHandlers");

// ~~~~~~~~~~~~~~~ ROUTERS ~~~~~~~~~~~~~~~
const apiRouter = require("./app/routes/api.routes");

// ~~~~~~~~~~~~~~~ STATIC FILES ~~~~~~~~~~~~~~~
app.use(express.static("public")); // Serve static files from the 'public' directory

// ~~~~~~~~~~~~~~~ GLOBAL MIDDLEWARE ~~~~~~~~~~~~~~~
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

// app.use(
//   cors({
//     origin: true, // ← TEMP: Accepts any origin dynamically
//     credentials: true,
//   })
// );
app.use(express.json());
app.use(cookieParser());

// ~~~~~~~~~~~~~~~ API ROUTER ~~~~~~~~~~~~~~~
app.use("/api", apiRouter);

// ~~~~~~~~~~~~~~~ CATCH-ALL ~~~~~~~~~~~~~~~
app.use((req, res) => {
  res.status(404).send({ msg: "Path not found!" });
});

// ~~~~~~~~~~~~~~~ ERROR HANDLING ~~~~~~~~~~~~~~~
app.use(handleCustomErrors);
app.use(handlePSQLErrors);
app.use(handleServerErrors);

module.exports = app;

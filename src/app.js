// ~~~~~~~~~~~~~~~ CORE MODULES ~~~~~~~~~~~~~~~
const express = require("express");
const app = express();
const cors = require("cors");

// ~~~~~~~~~~~~~~~ ERROR HANDLERS ~~~~~~~~~~~~~~~
const {
  handleCustomErrors,
  handleServerErrors,
  handlePSQLErrors,
} = require("./errors/errorHandlers");

// ~~~~~~~~~~~~~~~ ROUTERS ~~~~~~~~~~~~~~~
const apiRouter = require("./app/routes/api.routes");

// ~~~~~~~~~~~~~~~ CORS ~~~~~~~~~~~~~~~
const allowedOrigins = [
  "http://localhost:5173",
  "https://daily-spews-client.onrender.com",
  "https://daily-spews.onrender.com",
];

// ~~~~~~~~~~~~~~~ STATIC FILES ~~~~~~~~~~~~~~~
app.use(express.static("public")); // Serve static files from the 'public' directory

// ~~~~~~~~~~~~~~~ GLOBAL MIDDLEWARE ~~~~~~~~~~~~~~~
app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (like mobile apps or curl)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`Not allowed by CORS: ${origin}`));
    },
    credentials: true, // allow cookies
  })
);
app.use(express.json());

// ~~~~~~~~~~~~~~~ API ROUTER ~~~~~~~~~~~~~~~
app.use("/api", apiRouter);

// ~~~~~~~~~~~~~~~ CATCH-ALL ~~~~~~~~~~~~~~~
app.use((req, res) => {
  res.status(404).send({ msg: "404: Path Not Found!" });
});

// ~~~~~~~~~~~~~~~ ERROR HANDLING ~~~~~~~~~~~~~~~
app.use(handleCustomErrors);
app.use(handlePSQLErrors);
app.use(handleServerErrors);

module.exports = app;

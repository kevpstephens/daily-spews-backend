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
const apiRouter = require("./app/routers/api.router");

// ~~~~~~~~~~~~~~~ STATIC FILES ~~~~~~~~~~~~~~~
app.use(express.static("public")); // Serve static files from the 'public' directory

// ~~~~~~~~~~~~~~~ GLOBAL MIDDLEWARE ~~~~~~~~~~~~~~~
app.use(cors());
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

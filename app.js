// ~~~~~~~~~~~~~~~ CORE MODULES ~~~~~~~~~~~~~~~
const express = require("express")
const app = express()


// ~~~~~~~~~~~~~~~ ERROR HANDLERS ~~~~~~~~~~~~~~~
const { handleCustomErrors, handleServerErrors, handlePSQLErrors } = require("./errors/errorHandlers.js");


// ~~~~~~~~~~~~~~~ CONTROLLERS ~~~~~~~~~~~~~~~
const apiRouter = require("./app/routers/api.router");


// ~~~~~~~~~~~~~~~ MIDDLEWARE ~~~~~~~~~~~~~~~
app.use(express.json());
app.use("/api", apiRouter);


// ~~~~~~~~~~~~~~~ CATCH-ALL ~~~~~~~~~~~~~~~
app.all("/*splat", (req, res) => {
    res.status(404).send({msg: "404: Path Not Found!"})
})


// ~~~~~~~~~~~~~~~ ERROR HANDLING ~~~~~~~~~~~~~~~
app.use(handleCustomErrors) 
app.use(handlePSQLErrors)
app.use(handleServerErrors)

module.exports = app
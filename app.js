const express = require("express")
const app = express()
const { getApi } = require("./app/controllers/api.cotroller.js")
const { getTopics } = require("./app/controllers/topics.controller.js")
const { handleCustomErrors, handleServerErrors, handlePSQLErrors } = require("./errors/errorHandlers.js")

app.use(express.json())

app.get("/api", getApi)
app.get("/api/topics", getTopics)

// Error Handling
app.use(handleCustomErrors) 
app.use(handlePSQLErrors)
app.use(handleServerErrors)

module.exports = app
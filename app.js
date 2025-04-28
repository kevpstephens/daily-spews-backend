const express = require("express")
const app = express()
const { getApi } = require("./app/controllers/api.cotroller.js")

app.use(express.json())

app.get("/api", getApi)

module.exports = app
const express = require("express")
const app = express()
const db = require("./db/connection.js")

app.use(express.json())

app.get("/api", (res, req) => {
    res.status(200).send({endpoints})
})

module.exports = app
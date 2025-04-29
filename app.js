const express = require("express")
const app = express()
const { getApi } = require("./app/controllers/api.cotroller.js")
const { getTopics, getArticlesById, getAllArticles, getCommentsByArticleId } = require("./app/controllers/topics.controller.js")
const { handleCustomErrors, handleServerErrors, handlePSQLErrors } = require("./errors/errorHandlers.js")


app.get("/api", getApi)
app.get("/api/topics", getTopics)
app.get("/api/articles/:article_id", getArticlesById)
app.get("/api/articles", getAllArticles)
// app.get("/api/articles/:article_id/comments", getCommentsByArticleId)


// Error Handling
app.use(handleCustomErrors) 
app.use(handlePSQLErrors)
app.use(handleServerErrors)

module.exports = app
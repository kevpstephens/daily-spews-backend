const express = require("express")
const app = express()
const { getApi } = require("./app/controllers/api.cotroller.js")
const { getTopics, getArticlesById, getAllArticles, getCommentsByArticleId, postCommentByArticleId, patchArticlebyId } = require("./app/controllers/topics.controller.js")
const { handleCustomErrors, handleServerErrors, handlePSQLErrors } = require("./errors/errorHandlers.js")

// Middleware
app.use(express.json())

// Endpoints
app.get("/api", getApi)
app.get("/api/topics", getTopics)
app.get("/api/articles/:article_id", getArticlesById)
app.get("/api/articles", getAllArticles)
app.get("/api/articles/:article_id/comments", getCommentsByArticleId)
app.post("/api/articles/:article_id/comments", postCommentByArticleId)
app.patch("/api/articles/:article_id", patchArticlebyId)


// Error Handling
app.use(handleCustomErrors) 
app.use(handlePSQLErrors)
app.use(handleServerErrors)

module.exports = app
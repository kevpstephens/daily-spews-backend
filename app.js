// ~~~~~~~~~~~~~~~~~~~~ Core modules ~~~~~~~~~~~~~~~~~~~~
const express = require("express")
const app = express()
// ~~~~~~~~~~~~~~~~~~~~ Controllers ~~~~~~~~~~~~~~~~~~~~
const { getApi } = require("./app/controllers/api.controller.js")
const { getArticlesById, getAllArticles, patchArticleById } = require("./app/controllers/articles.controller.js")
const { getCommentsByArticleId, deleteCommentById, postCommentByArticleId } = require("./app/controllers/comments.controller.js")
const { getTopics } = require("./app/controllers/topics.controller.js")
const { getUsers } = require("./app/controllers/users.controller.js")
// ~~~~~~~~~~~~~~~~~~~~ Error Handlers ~~~~~~~~~~~~~~~~~~~~
const { handleCustomErrors, handleServerErrors, handlePSQLErrors } = require("./errors/errorHandlers.js")



// ~~~~~~~~~~~~~~~~~~~~ Middleware ~~~~~~~~~~~~~~~~~~~~
app.use(express.json())


// ~~~~~~~~~~~~~~~~~~~~ Endpoints ~~~~~~~~~~~~~~~~~~~~
// API info
app.get("/api", getApi)

// Articles
app.get("/api/articles/:article_id", getArticlesById)
app.get("/api/articles", getAllArticles)
app.patch("/api/articles/:article_id", patchArticleById)

// Comments
app.get("/api/articles/:article_id/comments", getCommentsByArticleId)
app.post("/api/articles/:article_id/comments", postCommentByArticleId)
app.delete("/api/comments/:comment_id", deleteCommentById)

// Topics
app.get("/api/topics", getTopics)

// Users
app.get("/api/users", getUsers)


// ~~~~~~~~~~~~~~~~~~~~ Error Handling ~~~~~~~~~~~~~~~~~~~~
app.use(handleCustomErrors) 
app.use(handlePSQLErrors)
app.use(handleServerErrors)

module.exports = app
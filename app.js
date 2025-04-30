// ~~~~~~~~~~~~~~~ CORE MODULES ~~~~~~~~~~~~~~~
const express = require("express")
const app = express()
// ~~~~~~~~~~~~~~~ CONTROLLERS ~~~~~~~~~~~~~~~
const { getApi } = require("./app/controllers/api.controller.js")
const { getArticlesById, getAllArticles, patchArticleById } = require("./app/controllers/articles.controller.js")
const { getCommentsByArticleId, deleteCommentById, postCommentByArticleId } = require("./app/controllers/comments.controller.js")
const { getTopics } = require("./app/controllers/topics.controller.js")
const { getUsers } = require("./app/controllers/users.controller.js")
// ~~~~~~~~~~~~~~~ ERROR HANDLERS ~~~~~~~~~~~~~~~
const { handleCustomErrors, handleServerErrors, handlePSQLErrors } = require("./errors/errorHandlers.js")



// ~~~~~~~~~~~~~~~ MIDDLEWARE ~~~~~~~~~~~~~~~
app.use(express.json())



// ~~~~~~~~~~~~~~~ ENDPOINTS ~~~~~~~~~~~~~~~
// API info
app.get("/api", getApi)

// Articles
app.get("/api/articles", getAllArticles)
app.get("/api/articles/:article_id", getArticlesById)
app.patch("/api/articles/:article_id", patchArticleById)

// Comments
app.get("/api/articles/:article_id/comments", getCommentsByArticleId)
app.post("/api/articles/:article_id/comments", postCommentByArticleId)
app.delete("/api/comments/:comment_id", deleteCommentById)

// Topics
app.get("/api/topics", getTopics)

// Users
app.get("/api/users", getUsers)

// Catch-all
app.all("/*splat", (req, res) => {
    res.status(404).send({msg: "404: Path Not Found!"})
})



// ~~~~~~~~~~~~~~~ ERROR HANDLING ~~~~~~~~~~~~~~~
app.use(handleCustomErrors) 
app.use(handlePSQLErrors)
app.use(handleServerErrors)

module.exports = app
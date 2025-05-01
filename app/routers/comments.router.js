const express = require("express");
const {
  getCommentsByArticleId,
  postCommentByArticleId,
  deleteCommentById,
} = require("../controllers/comments.controller");

const commentsRouter = express.Router();

// GET comments for specified article
commentsRouter.get("/articles/:article_id/comments", getCommentsByArticleId);

// POST comment to a specified article
commentsRouter.post("/articles/:article_id/comments", postCommentByArticleId);

// DELETE comment via comment_id
commentsRouter.delete("/comments/:comment_id", deleteCommentById);

module.exports = commentsRouter;
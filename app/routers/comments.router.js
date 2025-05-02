const express = require("express");
const {
  getCommentsByArticleId,
  postCommentByArticleId,
  deleteCommentById,
  patchCommentById,
} = require("../controllers/comments.controller");

const commentsRouter = express.Router();

// GET comments for specified article
commentsRouter.get("/articles/:article_id/comments", getCommentsByArticleId);

// POST comment to a specified article
commentsRouter.post("/articles/:article_id/comments", postCommentByArticleId);

// PATCH comment to update votes
commentsRouter.patch("/comments/:comment_id", patchCommentById);

// DELETE comment via comment_id
commentsRouter.delete("/comments/:comment_id", deleteCommentById);

module.exports = commentsRouter;

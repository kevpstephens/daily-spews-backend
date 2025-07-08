import express from "express";
import {
  getCommentsByArticleId,
  postCommentByArticleId,
  deleteCommentById,
  patchCommentById,
} from "../controllers/comments.controller.js";

const commentsRouter = express.Router();

//! GET /api/articles/:article_id/comments
commentsRouter.get("/articles/:article_id/comments", getCommentsByArticleId);

//! POST /api/articles/:article_id/comments
commentsRouter.post("/articles/:article_id/comments", postCommentByArticleId);

//! PATCH /api/comments/:comment_id
commentsRouter.patch("/comments/:comment_id", patchCommentById);

//! DELETE /api/comments/:comment_id
commentsRouter.delete("/comments/:comment_id", deleteCommentById);

export default commentsRouter;

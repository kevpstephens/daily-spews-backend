import express from "express";
import {
  getArticlesById,
  getAllArticles,
  patchArticleById,
  postArticle,
  deleteArticleById,
} from "../controllers/articles.controller.js";
import upload from "../middleware/multer.js";

const articlesRouter = express.Router();

//! GET /api/articles
articlesRouter.get("/", getAllArticles);

//! GET /api/articles/:article_id
articlesRouter.get("/:article_id", getArticlesById);

//! POST api/articles
articlesRouter.post("/", upload.single("article_img"), postArticle);

//! PATCH /api/articles/:article_id
articlesRouter.patch("/:article_id", patchArticleById);

//! DELETE /api/articles/:article_id
articlesRouter.delete("/:article_id", deleteArticleById);

export default articlesRouter;

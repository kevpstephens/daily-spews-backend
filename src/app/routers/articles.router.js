const express = require("express");
const {
  getArticlesById,
  getAllArticles,
  patchArticleById,
  postArticle,
} = require("../controllers/articles.controller");

const articlesRouter = express.Router();

//! GET /api/articles
articlesRouter.get("/", getAllArticles);

//! GET /api/article/:article_id
articlesRouter.get("/:article_id", getArticlesById);

//! POST api/articles
articlesRouter.post("/", postArticle);

//! PATCH /api/articles/:article_id
articlesRouter.patch("/:article_id", patchArticleById);

module.exports = articlesRouter;

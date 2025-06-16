const express = require("express");
const {
  getArticlesById,
  getAllArticles,
  patchArticleById,
  postArticle,
} = require("../controllers/articles.controller");

const articlesRouter = express.Router();

// GET all articles
articlesRouter.get("/", getAllArticles);

// GET article via article_id
articlesRouter.get("/:article_id", getArticlesById);

// POST new article
articlesRouter.post("/", postArticle)

// PATCH article votes
articlesRouter.patch("/:article_id", patchArticleById);

module.exports = articlesRouter;

const express = require("express");
const {
  getArticlesById,
  getAllArticles,
  patchArticleById,
} = require("../controllers/articles.controller");

const articlesRouter = express.Router();

// GET all articles
articlesRouter.get("/", getAllArticles);

// GET article via article_id
articlesRouter.get("/:article_id", getArticlesById);

// PATCH article votes
articlesRouter.patch("/:article_id", patchArticleById);

module.exports = articlesRouter;

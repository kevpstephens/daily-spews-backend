const express = require("express");
const {
  getArticlesById,
  getAllArticles,
  patchArticleById,
  postArticle,
  deleteArticleById,
} = require("../controllers/articles.controller");
const upload = require("../middleware/multer");

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

module.exports = articlesRouter;

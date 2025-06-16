const { sort } = require("../../db/data/test-data/articles.js");
const {
  selectArticleById,
  selectAllArticles,
  updateArticleById,
  insertArticle,
} = require("../models/articles.model.js");
const { selectUserByUsername } = require("../models/users.model.js");
const { getUserByUsername } = require("./users.controller.js");

exports.getAllArticles = async (req, res, next) => {
  const { sort_by, order, topic } = req.query;

  try {
    const articles = await selectAllArticles(sort_by, order, topic);
    res.status(200).send({ articles });
  } catch (err) {
    next(err);
  }
};

exports.getArticlesById = async (req, res, next) => {
  const { article_id } = req.params;

  if (isNaN(Number(article_id))) {
    return res.status(400).send({ msg: "Bad request!" });
  }

  try {
    const article = await selectArticleById(article_id);
    res.status(200).send({ article });
  } catch (err) {
    next(err);
  }
};

exports.patchArticleById = async (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;

  if (isNaN(inc_votes) || isNaN(article_id)) {
    return res.status(400).send({ msg: "Bad request!" });
  }

  try {
    await selectArticleById(article_id);
    const updatedArticle = await updateArticleById(inc_votes, article_id);
    res.status(200).send({ article: updatedArticle });
  } catch (err) {
    next(err);
  }
};

exports.postArticle = async (req, res, next) => {
  const { author, title, body, topic, article_img_url } = req.body

  if (!author || !title || !body || !topic) {
    return res.status(400).send({ msg: "Missing required fields!" });
  }

  try {
    await selectUserByUsername(author)
    const newArticle = await insertArticle({
      author,
      title,
      body,
      topic,
      article_img_url,
    });
    res.status(201).send({ newArticle });
  } catch (err) {
    next(err);
  }
};

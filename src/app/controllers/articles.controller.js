// Import article model functions and user lookup helper
const {
  selectArticleById,
  selectAllArticles,
  updateArticleById,
  insertArticle,
} = require("../models/articles.model.js");
const { selectUserByUsername } = require("../models/users.model.js");

//! GET /api/articles
exports.getAllArticles = async (req, res, next) => {
  // Extract query parameters for sorting, ordering, filtering, and pagination
  const { sort_by, order, topic, limit, p } = req.query;

  try {
    // Attempt to retrieve all matching articles using the provided query params
    const { articles, total_count } = await selectAllArticles({
      sort_by,
      order,
      topic,
      limit: limit !== undefined ? Number(limit) : undefined,
      p: p !== undefined ? Number(p) : undefined,
    });

    // Respond with array of articles and total count for pagination
    res.status(200).send({ articles, total_count });
  } catch (err) {
    next(err);
  }
};

//! GET /api/article/:article_id
exports.getArticlesById = async (req, res, next) => {
  // Extract article ID from route parameters
  const { article_id } = req.params;
  // Validate that article_id is a number
  if (isNaN(Number(article_id))) {
    return res.status(400).send({ msg: "Bad request!" });
  }

  // Attempt to fetch the article by its ID
  try {
    const article = await selectArticleById(article_id);
    res.status(200).send({ article });
  } catch (err) {
    next(err);
  }
};

//! POST api/articles
exports.postArticle = async (req, res, next) => {
  // Extract required fields from request body for new article creation
  const { author, title, body, topic, article_img_url } = req.body;

  // Ensure required fields are present
  if (!author || !title || !body || !topic) {
    return res.status(400).send({ msg: "Missing required fields!" });
  }

  try {
    // Validate author exists before creating article
    await selectUserByUsername(author);
    // Insert new article and respond with the created object
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

//! PATCH /api/articles/:article_id
exports.patchArticleById = async (req, res, next) => {
  // Extract article ID and vote increment value from request
  const { article_id } = req.params;
  const { inc_votes } = req.body;

  // Validate that both are numbers
  if (isNaN(inc_votes) || isNaN(article_id)) {
    return res.status(400).send({ msg: "Bad request!" });
  }

  try {
    // Check article exists before applying vote update
    await selectArticleById(article_id);
    // Apply vote increment and respond with updated article
    const updatedArticle = await updateArticleById(inc_votes, article_id);
    res.status(200).send({ article: updatedArticle });
  } catch (err) {
    next(err);
  }
};

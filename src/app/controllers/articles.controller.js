import {
  selectArticleById,
  selectAllArticles,
  updateArticleById,
  insertArticle,
  removeArticleById,
} from "../models/articles.model.js";
import { selectUserByUsername } from "../models/users.model.js";
import uploadToSupabase from "../../utils/uploadToSupabase.js";
import logger from "../../utils/logger.js";

//! GET /api/articles
export const getAllArticles = async (req, res, next) => {
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
    return res.status(200).send({ articles, total_count });
  } catch (err) {
    return next(err);
  }
};

//! GET /api/article/:article_id
export const getArticlesById = async (req, res, next) => {
  // Extract article ID from route parameters
  const { article_id } = req.params;

  if (Number.isNaN(Number(article_id))) {
    return res.status(400).send({ msg: "Bad request!" });
  }

  try {
    const article = await selectArticleById(article_id);
    return res.status(200).send({ article });
  } catch (err) {
    return next(err);
  }
};

//! POST api/articles
export const postArticle = async (req, res, next) => {
  const { author, title, body, topic } = req.body;
  let { article_img_url } = req.body;

  if (!author || !title || !body || !topic) {
    return res.status(400).send({ msg: "Missing required fields!" });
  }

  try {
    await selectUserByUsername(author);

    // If a file was uploaded, try uploading to Supabase
    if (req.file) {
      try {
        article_img_url = await uploadToSupabase(req.file, "article-images");
      } catch (uploadErr) {
        logger.error("Failed to upload image to Supabase:", uploadErr);
        return res.status(500).send({ msg: "Image upload failed." });
      }
    }

    const newArticle = await insertArticle({
      author,
      title,
      body,
      topic,
      article_img_url,
    });

    return res.status(201).send({ newArticle });
  } catch (err) {
    logger.error("Server error in postArticle:", err);
    return next(err);
  }
};

//! PATCH /api/articles/:article_id
export const patchArticleById = async (req, res, next) => {
  // Extract article ID and vote increment value from request
  const { article_id } = req.params;
  const { inc_votes } = req.body;

  if (Number.isNaN(inc_votes) || Number.isNaN(article_id)) {
    return res.status(400).send({ msg: "Bad request!" });
  }

  try {
    // Check article exists before applying vote update
    await selectArticleById(article_id);
    // Apply vote increment and respond with updated article
    const updatedArticle = await updateArticleById(inc_votes, article_id);
    return res.status(200).send({ article: updatedArticle });
  } catch (err) {
    return next(err);
  }
};

//! DELETE /api/articles/:article_id
export const deleteArticleById = async (req, res, next) => {
  const { article_id } = req.params;

  if (Number.isNaN(Number(article_id))) {
    return res.status(400).send({ msg: "Bad request!" });
  }

  try {
    await removeArticleById(article_id);
    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
};

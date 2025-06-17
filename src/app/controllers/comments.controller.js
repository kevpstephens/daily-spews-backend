const { selectArticleById } = require("../models/articles.model");
const {
  selectCommentsByArticleId,
  removeCommentById,
  insertCommentByArticleId,
  updateCommentVotesById,
} = require("../models/comments.model");

//! GET /api/articles/:article_id/comments
exports.getCommentsByArticleId = async (req, res, next) => {
  // Extract article ID and pagination query params from request
  const { article_id } = req.params;
  const { limit = 10, p = 1 } = req.query;

  // Validate pagination queries
  const limitNum = Number(limit);
  const pageNum = Number(p);

  if (isNaN(limitNum) || limitNum < 1 || isNaN(pageNum) || pageNum < 1) {
    return res.status(400).send({ msg: "Invalid pagination query!" });
  }

  // Calculate offset for pagination
  const offset = (pageNum - 1) * limitNum;

  try {
    const { comments, total_count } = await selectCommentsByArticleId(
      article_id,
      limitNum,
      offset
    );
    res.status(200).send({ comments, total_count });
  } catch (err) {
    next(err);
  }
};

// !POST /api/articles/:article_id/comments
exports.postCommentByArticleId = async (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;

  if (!body || isNaN(article_id)) {
    return res.status(400).send({ msg: "Bad request!" });
  }

  try {
    // Ensure article exists before inserting comment
    await selectArticleById(article_id);
    const newComment = await insertCommentByArticleId(article_id, {
      username,
      body,
    });
    res.status(201).send({ comment: newComment });
  } catch (err) {
    next(err);
  }
};

//! DELETE /api/comments/:comment_id
exports.deleteCommentById = async (req, res, next) => {
  // Extract comment ID from route parameters
  const { comment_id } = req.params;

  if (isNaN(comment_id)) {
    return res.status(400).send({ msg: "Bad request!" });
  }

  try {
    await removeCommentById(comment_id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

//! PATCH /api/comments/:comment_id
exports.patchCommentById = async (req, res, next) => {
  // Extract comment ID and inc_votes from request body
  const { comment_id } = req.params;
  const { inc_votes } = req.body;

  if (isNaN(comment_id) || isNaN(inc_votes)) {
    return res.status(400).send({ msg: "Bad Request!" });
  }

  try {
    const updatedComment = await updateCommentVotesById(comment_id, inc_votes);
    res.status(200).send({ updatedComment });
  } catch (err) {
    next(err);
  }
};

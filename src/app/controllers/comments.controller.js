const { selectArticleById } = require("../models/articles.model");
const {
  selectCommentsByArticleId,
  removeCommentById,
  insertCommentByArticleId,
  updateCommentVotesById,
} = require("../models/comments.model");

//! GET /api/articles/:article_id/comments
exports.getCommentsByArticleId = async (req, res, next) => {
  const { article_id } = req.params;
  const { limit = 10, p = 1 } = req.query;

  const limitNum = Number(limit);
  const pageNum = Number(p);

  if (
    Number.isNaN(limitNum) ||
    limitNum < 1 ||
    Number.isNaN(pageNum) ||
    pageNum < 1
  ) {
    return res.status(400).send({ msg: "Invalid pagination query!" });
  }

  // Calculate offset for pagination
  const offset = (pageNum - 1) * limitNum;

  try {
    const { comments, total_count } = await selectCommentsByArticleId(
      article_id,
      limitNum,
      offset,
    );
    return res.status(200).send({ comments, total_count });
  } catch (err) {
    return next(err);
  }
};

// !POST /api/articles/:article_id/comments
exports.postCommentByArticleId = async (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;

  if (!body || Number.isNaN(article_id)) {
    return res.status(400).send({ msg: "Bad request!" });
  }

  try {
    // Ensure article exists before inserting comment - prevents orphaned comments
    await selectArticleById(article_id);
    // Note: username validation handled by auth middleware
    const newComment = await insertCommentByArticleId(article_id, {
      username,
      body,
    });
    return res.status(201).send({ comment: newComment });
  } catch (err) {
    return next(err);
  }
};

//! DELETE /api/comments/:comment_id
exports.deleteCommentById = async (req, res, next) => {
  // Extract comment ID from route parameters
  const { comment_id } = req.params;

  if (Number.isNaN(Number(comment_id))) {
    return res.status(400).send({ msg: "Bad request!" });
  }

  try {
    await removeCommentById(comment_id);
    // 204 No Content - successful deletion with no response body
    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
};

//! PATCH /api/comments/:comment_id
exports.patchCommentById = async (req, res, next) => {
  const { comment_id } = req.params;
  const { inc_votes } = req.body;

  if (
    Number.isNaN(Number(comment_id)) ||
    inc_votes === undefined ||
    Number.isNaN(Number(inc_votes))
  ) {
    return res.status(400).send({ msg: "Bad request!" });
  }

  try {
    // inc_votes can be positive (upvote) or negative (downvote)
    const updatedComment = await updateCommentVotesById(comment_id, inc_votes);
    return res.status(200).send({ updatedComment });
  } catch (err) {
    return next(err);
  }
};

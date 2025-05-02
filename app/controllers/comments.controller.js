const { selectArticleById } = require("../models/articles.model");
const {
  selectCommentsByArticleId,
  removeCommentById,
  insertCommentByArticleId,
  updateCommentVotesById,
} = require("../models/comments.model");

exports.getCommentsByArticleId = async (req, res, next) => {
  const { article_id } = req.params;

  try {
    const comments = await selectCommentsByArticleId(article_id);
    res.status(200).send({ comments });
  } catch (err) {
    next(err);
  }
};

exports.postCommentByArticleId = async (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;

  if (!body || isNaN(article_id)) {
    return res.status(400).send({ msg: "Bad request!" });
  }

  try {
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

exports.deleteCommentById = async (req, res, next) => {
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

exports.patchCommentById = async (req, res, next) => {
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

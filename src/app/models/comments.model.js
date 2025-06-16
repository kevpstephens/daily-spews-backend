const db = require("../../db/connection.js");

//! GET /api/articles/:article_id/comments
// Retrieves paginated comments for a given article along with the total count.
exports.selectCommentsByArticleId = async (
  article_id,
  limit = 10,
  offset = 0
) => {
  // Query to fetch paginated comments for the specified article_id
  const commentsQuery = `
    SELECT
      comments.comment_id,
      comments.votes,
      comments.created_at,
      comments.author,
      comments.body,
      comments.article_id
    FROM comments
    WHERE article_id = $1
    ORDER BY created_at DESC
    LIMIT $2 OFFSET $3;
  `;

  // Query to count the total number of comments for the article (for pagination metadata)
  const countQuery = `
    SELECT COUNT(*)::INT AS total_count FROM comments WHERE article_id = $1;
  `;

  // Query to confirm the article exists before returning comments
  const articleCheckQuery = `
    SELECT * FROM articles WHERE article_id = $1;
  `;

  const [commentsResult, countResult, articleResult] = await Promise.all([
    db.query(commentsQuery, [article_id, limit, offset]),
    db.query(countQuery, [article_id]),
    db.query(articleCheckQuery, [article_id]),
  ]);

  // If the article doesn't exist, throw a 404 error
  if (!articleResult.rows.length) {
    throw {
      status: 404,
      msg: "Article not found!",
    };
  }

  // Return paginated comments and total count
  return {
    comments: commentsResult.rows,
    total_count: countResult.rows[0].total_count,
  };
};

// !POST /api/articles/:article_id/comments
exports.insertCommentByArticleId = async (article_id, { username, body }) => {
  const queryStr = `
          INSERT INTO comments
              (article_id, author, body)
              VALUES 
              ($1, $2, $3)
          RETURNING*;
          `;

  const result = await db.query(queryStr, [article_id, username, body]);

  return result.rows[0];
};

//! DELETE /api/comments/:comment_id
exports.removeCommentById = async (comment_id) => {
  const queryStr = `
          DELETE FROM comments
          WHERE comment_id = $1
          RETURNING *;
          `;

  const result = await db.query(queryStr, [comment_id]);

  if (!result.rows.length) {
    throw {
      status: 404,
      msg: "Comment not found!",
    };
  }
};

//! PATCH /api/comments/:comment_id
// Updates vote count for a specified comment
exports.updateCommentVotesById = async (comment_id, inc_votes) => {
  const queryStr = `
    UPDATE comments
    SET votes = votes + $1
    WHERE comment_id = $2
    RETURNING *;`;

  const result = await db.query(queryStr, [inc_votes, comment_id]);

  if (!result.rows.length) {
    throw {
      status: 404,
      msg: "Comment does not exist!",
    };
  }

  return result.rows[0];
};

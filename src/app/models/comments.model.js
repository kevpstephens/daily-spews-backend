import db from "../../db/connection.js";

/**
 * ! GET /api/articles/:article_id/comments
 * Retrieves paginated comments for a given article with total count
 * @param {number} article_id - ID of the article to get comments for
 * @param {number} limit - Number of comments per page (default: 10)
 * @param {number} offset - Number of comments to skip (default: 0)
 * @returns {Object} Object containing comments array and total_count
 */

export const selectCommentsByArticleId = async (
  article_id,
  limit = 10,
  offset = 0,
) => {
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

  const articleCheckQuery = `
    SELECT * FROM articles WHERE article_id = $1;
  `;

  const [commentsResult, countResult, articleResult] = await Promise.all([
    db.query(commentsQuery, [article_id, limit, offset]),
    db.query(countQuery, [article_id]),
    db.query(articleCheckQuery, [article_id]),
  ]);

  if (!articleResult.rows.length) {
    const error = new Error("Article not found!");
    error.status = 404;
    throw error;
  }

  // Return paginated comments and total count
  return {
    comments: commentsResult.rows,
    total_count: countResult.rows[0].total_count,
  };
};

/**
 * ! POST /api/articles/:article_id/comments
 * Creates a new comment for an article
 * @param {number} article_id - ID of the article to comment on
 * @param {Object} commentData - Comment data
 * @param {string} commentData.username - Author of the comment
 * @param {string} commentData.body - Comment text content
 * @returns {Object} Newly created comment object
 */

export const insertCommentByArticleId = async (
  article_id,
  { username, body },
) => {
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

/**
 * ! DELETE /api/comments/:comment_id
 * Removes a comment from the database
 * @param {number} comment_id - ID of the comment to delete
 */

export const removeCommentById = async (comment_id) => {
  const queryStr = `
          DELETE FROM comments
          WHERE comment_id = $1
          RETURNING *;
          `;

  const result = await db.query(queryStr, [comment_id]);

  if (!result.rows.length) {
    const error = new Error("Comment not found!");
    error.status = 404;
    throw error;
  }
};

/**
 * ! PATCH /api/comments/:comment_id
 * Updates the vote count of a comment
 * @param {number} comment_id - ID of the comment to update
 * @param {number} inc_votes - Amount to increment votes by (can be negative)
 * @returns {Object} Updated comment object
 */

export const updateCommentVotesById = async (comment_id, inc_votes) => {
  const queryStr = `
    UPDATE comments
    SET votes = votes + $1
    WHERE comment_id = $2
    RETURNING *;`;

  const result = await db.query(queryStr, [inc_votes, comment_id]);

  if (!result.rows.length) {
    const error = new Error("Comment does not exist!");
    error.status = 404;
    throw error;
  }

  return result.rows[0];
};

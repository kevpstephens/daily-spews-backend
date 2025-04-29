const db = require("../../db/connection.js");

exports.selectCommentsByArticleId = async (article_id) => {
    const queryStr = `
          SELECT
              comments.comment_id,
              comments.votes,
              comments.created_at,
              comments.author,
              comments.body,
              comments.article_id
          FROM comments
          WHERE article_id = $1
          ORDER BY created_at DESC;
          `;
  
    const result = await db.query(queryStr, [article_id]);
  
    if (!result.rows.length) {
      throw {
        status: 404,
        msg: `Article not found!`,
      };
    }
  
    return result.rows;
  };

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
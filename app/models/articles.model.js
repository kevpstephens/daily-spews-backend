const db = require("../../db/connection.js");

exports.selectArticleById = async (article_id) => {
    const queryStr = `
      SELECT * FROM articles 
      WHERE article_id = $1
      `;
  
    const result = await db.query(queryStr, [article_id]);
  
    if (!result.rows.length) {
      throw {
        status: 404,
        msg: `Article not found!`,
      };
    }
    return result.rows[0];
  };
  
  exports.selectAllArticles = async (sort_by = "created_at", order = "desc") => {
    const validSortByColumns = ["author", "title", "article_id", "topic", "created_at", "votes", "article_img_url", "comment_count"]
    const validSortByOrders = ["asc", "desc"]

    if (!validSortByColumns.includes(sort_by)) {
      throw {
        status: 400,
        msg: "Invalid sort_by column!"
      }
    }

    if (!validSortByOrders.includes(order)) {
      throw {
        status: 400,
        msg: "Invalid order_by value!"
      }
    }
    
    const queryStr = `
          SELECT 
              articles.author, 
              articles.title, 
              articles.article_id, 
              articles.topic, 
              articles.created_at, 
              articles.votes, 
              articles.article_img_url,
              COUNT(comments.comment_id)::INT AS comment_count
          FROM articles
          LEFT JOIN comments
          ON articles.article_id = comments.article_id
          GROUP BY articles.article_id
          ORDER BY ${sort_by} ${order.toUpperCase()};
          `;
  
    const result = await db.query(queryStr);
    return result.rows;
  };

  exports.updateArticleById = async (inc_votes, article_id) => {
    const queryStr = `
          UPDATE articles
          SET votes = votes + $1
          WHERE article_id = $2
          RETURNING *;
          `;
  
    const result = await db.query(queryStr, [inc_votes, article_id]);
  
    if (!result.rows.length) {
      throw {
        status: 404,
        msg: `Article not found!`,
      };
    }
    return result.rows[0];
  };
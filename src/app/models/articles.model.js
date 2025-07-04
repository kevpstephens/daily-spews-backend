const db = require("../../db/connection.js");

//! GET /api/articles
exports.selectAllArticles = async ({
  sort_by = "created_at",
  order = "desc",
  topic,
  limit = 10,
  p = 1,
}) => {
  // Validate sort_by column to prevent SQL injection and ensure valid sorting
  const validSortByColumns = [
    "author",
    "title",
    "article_id",
    "topic",
    "created_at",
    "votes",
    "article_img_url",
    "comment_count",
  ];
  // Validate order parameter to be either ascending or descending
  const validSortByOrders = ["asc", "desc"];

  if (!validSortByColumns.includes(sort_by)) {
    throw {
      status: 400,
      msg: "Invalid sort_by column!",
    };
  }

  if (!validSortByOrders.includes(order)) {
    throw {
      status: 400,
      msg: "Invalid order_by value!",
    };
  }

  // Validate pagination parameters to ensure positive integers
  if (isNaN(limit) || limit < 1 || isNaN(p) || p < 1) {
    throw {
      status: 400,
      msg: "Invalid pagination query!",
    };
  }

  // Calculate offset for pagination based on page number and limit
  const offset = (p - 1) * limit;
  const queriedTopic = [];
  let whereClauseStr = "";

  if (topic) {
    // Check if the provided topic exists in the topics table
    const queryStr = "SELECT * FROM topics WHERE slug = $1";
    const checkTopicExists = await db.query(queryStr, [topic]);

    if (checkTopicExists.rows.length === 0) {
      throw {
        status: 404,
        msg: "Topic does not exist!",
      };
    }
    // Add topic filter to query parameters and SQL WHERE clause
    queriedTopic.push(topic);
    whereClauseStr += "WHERE topic = $1";
  }

  // Query to get total count of articles matching the filter (for pagination info)
  const totalCountQuery = `
  SELECT COUNT(*)::INT AS total_count FROM articles ${whereClauseStr};
`;

  // Main query to fetch paginated articles with comment counts, filtered and sorted
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
        ${whereClauseStr}
        GROUP BY articles.article_id
        ORDER BY ${sort_by} ${order.toUpperCase()}
        LIMIT $${queriedTopic.length + 1}
        OFFSET $${queriedTopic.length + 2};
        `;

  // Execute total count and paginated article queries
  const totalResult = await db.query(totalCountQuery, queriedTopic);
  const articlesResult = await db.query(queryStr, [
    ...queriedTopic,
    limit,
    offset,
  ]);

  // Return total count and the array of article objects
  return {
    total_count: totalResult.rows[0].total_count,
    articles: articlesResult.rows,
  };
};

//! GET /api/article/:article_id
exports.selectArticleById = async article_id => {
  // Query to fetch a single article by ID with a LEFT JOIN to count comments
  const queryStr = `
    SELECT 
      articles.author,
      articles.title,
      articles.article_id,
      articles.topic,
      articles.created_at,
      articles.votes,
      articles.body,
      articles.article_img_url,
      COUNT(comments.comment_id)::INT AS comment_count
    FROM articles
    LEFT JOIN comments ON comments.article_id = articles.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id;
  `;

  const result = await db.query(queryStr, [article_id]);

  if (!result.rows.length) {
    throw {
      status: 404,
      msg: "Article not found!",
    };
  }
  return result.rows[0];
};

//! POST api/articles
exports.insertArticle = async ({
  author,
  title,
  body,
  topic,
  article_img_url = "/images/default-profile.png",
}) => {
  // Use default image URL if none provided
  const values = [author, title, body, topic, article_img_url];
  // Insert a new article into the database
  const queryStr = `INSERT INTO articles 
    (author, title, body, topic, article_img_url)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;`;

  const result = await db.query(queryStr, values);
  const newArticle = result.rows[0];
  // Initialise comment count to zero for the new article
  newArticle.comment_count = 0;

  return newArticle;
};

//! PATCH /api/articles/:article_id
exports.updateArticleById = async (inc_votes, article_id) => {
  // Safely update the votes count by incrementing with provided value
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
      msg: "Article not found!",
    };
  }
  return result.rows[0];
};

//! DELETE /api/articles/:article_id
exports.removeArticleById = async article_id => {
  const result = await db.query(
    "DELETE FROM articles WHERE article_id = $1 RETURNING *;",
    [article_id]
  );

  if (result.rows.length === 0) {
    throw { status: 404, msg: "Article not found!" };
  }
};

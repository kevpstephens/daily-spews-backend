const db = require("../../db/connection");

/**
 * ! GET /api/articles
 * Retrieves paginated articles with optional filtering and sorting
 * @param {Object} params - Query parameters
 * @param {string} params.sort_by - Column to sort by (default: "created_at")
 * @param {string} params.order - Sort order "asc" or "desc" (default: "desc")
 * @param {string} params.topic - Optional topic filter
 * @param {number} params.limit - Number of articles per page (default: 10)
 * @param {number} params.p - Page number (default: 1)
 * @returns {Object} Object containing articles array and total_count
 */

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
  const validSortByOrders = ["asc", "desc"];

  if (!validSortByColumns.includes(sort_by)) {
    const error = new Error("Invalid sort_by column!");
    error.status = 400;
    throw error;
  }

  if (!validSortByOrders.includes(order)) {
    const error = new Error("Invalid order_by value!");
    error.status = 400;
    throw error;
  }

  // Validate pagination parameters to ensure positive integers
  if (
    Number.isNaN(Number(limit)) ||
    limit < 1 ||
    Number.isNaN(Number(p)) ||
    p < 1
  ) {
    const error = new Error("Invalid pagination query!");
    error.status = 400;
    throw error;
  }

  // Calculate offset for pagination based on page number and limit
  const offset = (p - 1) * limit;
  const queriedTopic = [];
  let whereClauseStr = "";

  if (topic) {
    // Check if the provided topic exists in the topics table
    const queryStr = `SELECT * FROM topics WHERE slug = $1`;
    const checkTopicExists = await db.query(queryStr, [topic]);

    if (checkTopicExists.rows.length === 0) {
      const error = new Error("Topic does not exist!");
      error.status = 404;
      throw error;
    }
    queriedTopic.push(topic);
    whereClauseStr += `WHERE topic = $1`;
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

  const totalResult = await db.query(totalCountQuery, queriedTopic);
  const articlesResult = await db.query(queryStr, [
    ...queriedTopic,
    limit,
    offset,
  ]);

  return {
    total_count: totalResult.rows[0].total_count,
    articles: articlesResult.rows,
  };
};

/**
 * ! GET /api/article/:article_id
 * Retrieves a single article by ID with comment count
 * @param {number} article_id - The ID of the article to retrieve
 * @returns {Object} Article object with comment count
 */

exports.selectArticleById = async (article_id) => {
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
    const error = new Error("Article not found!");
    error.status = 404;
    throw error;
  }

  return result.rows[0];
};

/**
 * ! POST /api/articles
 * Creates a new article in the database
 * @param {Object} articleData - Article data
 * @param {string} articleData.author - Username of the author
 * @param {string} articleData.title - Article title
 * @param {string} articleData.body - Article content
 * @param {string} articleData.topic - Article topic
 * @param {string} articleData.article_img_url - Optional image URL (defaults to default image)
 * @returns {Object} Newly created article with comment_count set to 0
 */

exports.insertArticle = async ({
  author,
  title,
  body,
  topic,
  article_img_url = "/images/default-profile.png",
}) => {
  const values = [author, title, body, topic, article_img_url];
  const queryStr = `INSERT INTO articles 
    (author, title, body, topic, article_img_url)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;`;

  const result = await db.query(queryStr, values);
  const newArticle = result.rows[0];
  // Set initial comment count for new articles
  newArticle.comment_count = 0;

  return newArticle;
};

/**
 * ! PATCH /api/articles/:article_id
 * Updates the vote count of an article
 * @param {number} inc_votes - Amount to increment votes by (can be negative)
 * @param {number} article_id - ID of the article to update
 * @returns {Object} Updated article object
 */

exports.updateArticleById = async (inc_votes, article_id) => {
  const queryStr = `
        UPDATE articles
        SET votes = votes + $1
        WHERE article_id = $2
        RETURNING *;
        `;

  const result = await db.query(queryStr, [inc_votes, article_id]);

  if (!result.rows.length) {
    const error = new Error("Article not found!");
    error.status = 404;
    throw error;
  }

  return result.rows[0];
};

/**
 * ! DELETE /api/articles/:article_id
 * Removes an article from the database
 * @param {number} article_id - ID of the article to delete
 */
exports.removeArticleById = async (article_id) => {
  const result = await db.query(
    `DELETE FROM articles WHERE article_id = $1 RETURNING *;`,
    [article_id],
  );

  if (result.rows.length === 0) {
    const error = new Error("Article not found!");
    error.status = 404;
    throw error;
  }
};

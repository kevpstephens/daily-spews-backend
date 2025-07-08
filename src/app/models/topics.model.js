import db from "../../db/connection.js";

/**
 * ! GET /api/topics
 * Retrieves all topics from the database
 * @returns {Array} Array of topic objects
 */

export const selectTopics = async () => {
  const queryStr = `SELECT * FROM topics;`;

  const result = await db.query(queryStr);

  return result.rows;
};

/**
 * ! POST /api/topics
 * Creates a new topic in the database
 * @param {Object} topicData - Topic data
 * @param {string} topicData.slug - URL-friendly topic identifier
 * @param {string} topicData.description - Topic description
 * @param {string} topicData.img_url - Topic image URL
 * @returns {Object} Newly created topic object
 */

export const insertTopic = async ({ slug, description, img_url }) => {
  if (!slug || !description || !img_url) {
    const error = new Error("Missing required topic fields!");
    error.status = 400;
    throw error;
  }

  const queryStr = `
    INSERT INTO topics (slug, description, img_url)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;

  const result = await db.query(queryStr, [slug, description, img_url]);

  return result.rows[0];
};

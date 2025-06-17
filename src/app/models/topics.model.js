const db = require("../../db/connection.js");

//! GET /api/topics
exports.selectTopics = async () => {
  const queryStr = `SELECT * FROM topics;`;

  const result = await db.query(queryStr);
  return result.rows;
};

//! POST /api/topics
exports.insertTopic = async ({ slug, description }) => {
  if (!slug || !description) {
    throw { status: 400, msg: "Missing required fields!" };
  }

  const queryStr = `
    INSERT INTO topics (slug, description)
    VALUES ($1, $2)
    RETURNING *;
  `;
  const result = await db.query(queryStr, [slug, description]);
  return result.rows[0];
};

const db = require("../../db/connection.js");

//! GET /api/topics
exports.selectTopics = async () => {
  const queryStr = `SELECT * FROM topics;`;

  const result = await db.query(queryStr);
  return result.rows;
};

//! POST /api/topics
exports.insertTopic = async ({ slug, description, img_url }) => {
  if (!slug || !description || !img_url) {
    throw { status: 400, msg: "Missing required fields!" };
  }

  const queryStr = `
    INSERT INTO topics (slug, description, img_url)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;
  const result = await db.query(queryStr, [slug, description, img_url]);
  return result.rows[0];
};

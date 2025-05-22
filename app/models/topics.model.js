const db = require("../../db/connection.js");

exports.selectTopics = async () => {
  const queryStr = `SELECT * FROM topics;`;

  const result = await db.query(queryStr);
  return result.rows;
};

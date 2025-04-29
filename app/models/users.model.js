const db = require("../../db/connection.js");

exports.selectAllUsers = async () => {
    const queryStr = `SELECT * FROM users;`;
    const result = await db.query(queryStr);
  
    return result.rows;
  };
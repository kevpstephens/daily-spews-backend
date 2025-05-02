const db = require("../../db/connection.js");

exports.selectAllUsers = async () => {
  const queryStr = `SELECT * FROM users;`;
  const result = await db.query(queryStr);

  return result.rows;
};

exports.selectUserByUsername = async (username) => {
  const queryStr = `SELECT * FROM users WHERE username = $1`
  const result = await db.query(queryStr, [username])

  if (!result.rows.length) {
    throw {
      status: 404,
      msg: "User does not exist!"
    }
  }

  return result.rows[0] 
}
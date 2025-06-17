const db = require("../../db/connection.js");

//! GET /api/users
exports.selectAllUsers = async () => {
  const queryStr = `SELECT * FROM users;`;
  const result = await db.query(queryStr);

  return result.rows;
};

//! GET /api/users/:username
exports.selectUserByUsername = async (username) => {
  const queryStr = `SELECT * FROM users WHERE username = $1`;
  const result = await db.query(queryStr, [username]);

  if (!result.rows.length) {
    throw {
      status: 404,
      msg: "User does not exist!",
    };
  }

  return result.rows[0];
};

//! POST /api/auth/register
exports.insertUser = async ({
  username,
  name,
  email,
  password_hash,
  avatar_url,
}) => {
  // Insert the user into the database
  const result = await db.query(
    `INSERT INTO users (username, name, email, password_hash, avatar_url)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING username, name, email, avatar_url;`,
    [username, name, email, password_hash, avatar_url]
  );
  return result.rows[0];
};

//! POST /api/auth/login
exports.selectUserByEmail = async (email) => {
  // Select the user by email
  const result = await db.query(`SELECT * FROM users WHERE email = $1;`, [
    email,
  ]);
  return result.rows[0];
};

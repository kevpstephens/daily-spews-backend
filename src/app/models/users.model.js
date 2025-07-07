const db = require("../../db/connection");

/**
 * ! GET /api/users
 * Retrieves all users from the database
 * @returns {Array} Array of complete user objects (including password_hash)
 */

exports.selectAllUsers = async () => {
  const queryStr = `SELECT * FROM users;`;
  const result = await db.query(queryStr);

  return result.rows;
};

/**
 * ! GET /api/users/:username
 * Retrieves a user by username
 * @param {string} username - Username to search for
 * @returns {Object} Complete user object (including password_hash)
 */

exports.selectUserByUsername = async (username) => {
  const queryStr = `SELECT * FROM users WHERE username = $1`;
  const result = await db.query(queryStr, [username]);

  if (!result.rows.length) {
    const error = new Error("User does not exist!");
    error.status = 404;
    throw error;
  }

  return result.rows[0];
};

/**
 * ! POST /api/auth/register
 * Creates a new user in the database
 * @param {Object} userData - User registration data
 * @param {string} userData.username - Unique username
 * @param {string} userData.name - User's display name
 * @param {string} userData.email - User's email address
 * @param {string} userData.password_hash - Hashed password
 * @param {string} userData.avatar_url - User's avatar image URL
 * @returns {Object} Created user object (excluding password_hash)
 */

exports.insertUser = async ({
  username,
  name,
  email,
  password_hash,
  avatar_url,
}) => {
  const result = await db.query(
    `INSERT INTO users (username, name, email, password_hash, avatar_url)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING username, name, email, avatar_url;`,
    [username, name, email, password_hash, avatar_url],
  );
  return result.rows[0];
};

/**
 * ! POST /api/auth/login
 * Retrieves a user by email address
 * @param {string} email - Email address to search for
 * @returns {Object|undefined} Complete user object (including password_hash) or undefined if not found
 */

exports.selectUserByEmail = async (email) => {
  const result = await db.query(`SELECT * FROM users WHERE email = $1;`, [
    email,
  ]);

  return result.rows[0];
};

/**
 * ! PATCH /api/users/:username/avatar
 * Updates a user's avatar URL
 * @param {string} username - Username of user to update
 * @param {string} avatar_url - New avatar image URL
 * @returns {Object} Updated user object (excluding password_hash)
 */

exports.updateUserAvatar = async (username, avatar_url) => {
  const result = await db.query(
    `
    UPDATE users
    SET avatar_url = $1
    WHERE username = $2
    RETURNING username, name, email, avatar_url;
    `,
    [avatar_url, username],
  );

  if (!result.rows.length) {
    const error = new Error("User does not exist!");
    error.status = 404;
    throw error;
  }

  return result.rows[0];
};

/**
 * ! PATCH /api/auth/:username/password
 * Updates a user's password hash
 * @param {string} username - Username of user to update
 * @param {string} hashedPassword - New hashed password
 * @returns {Object} Updated user object with just username
 */

exports.updateUserPasswordByUsername = async (username, hashedPassword) => {
  const queryStr = `
    UPDATE users
    SET password_hash = $1
    WHERE username = $2
    RETURNING username;
  `;

  const result = await db.query(queryStr, [hashedPassword, username]);

  if (!result.rows.length) {
    const error = new Error("User not found");
    error.status = 404;
    throw error;
  }

  return result.rows[0];
};

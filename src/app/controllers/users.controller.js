const {
  selectAllUsers,
  selectUserByUsername,
} = require("../models/users.model");

//! GET /api/users
exports.getUsers = async (req, res, next) => {
  try {
    const users = await selectAllUsers();
    res.status(200).send({ users });
  } catch (err) {
    next(err);
  }
};

//! GET /api/users/me (protected)
exports.getCurrentUser = async (req, res, next) => {
  try {
    const user = await selectUserByUsername(req.user.username);
    res.status(200).send({ user });
  } catch (err) {
    next(err);
  }
};

//! GET /api/users/:username
exports.getUserByUsername = async (req, res, next) => {
  const { username } = req.params;

  try {
    const user = await selectUserByUsername(username);
    res.status(200).send({ user });
  } catch (err) {
    next(err);
  }
};

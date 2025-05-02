const {
  selectAllUsers,
  selectUserByUsername,
} = require("../models/users.model");

exports.getUsers = async (req, res, next) => {
  try {
    const users = await selectAllUsers();
    res.status(200).send({ users });
  } catch (err) {
    next(err);
  }
};

exports.getUserByUsername = async (req, res, next) => {
  const { username } = req.params;

  try {
    const user = await selectUserByUsername(username);
    res.status(200).send({ user });
  } catch (err) {
    next(err);
  }
};

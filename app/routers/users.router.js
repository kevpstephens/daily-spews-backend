const express = require("express");
const {
  getUsers,
  getUserByUsername,
} = require("../controllers/users.controller");

const usersRouter = express.Router();

// GET all users
usersRouter.get("/", getUsers);

// GET user by username
usersRouter.get("/:username", getUserByUsername);

module.exports = usersRouter;

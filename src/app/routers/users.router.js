const express = require("express");
const {
  getUsers,
  getUserByUsername,
} = require("../controllers/users.controller");

const usersRouter = express.Router();

//! GET /api/users
usersRouter.get("/", getUsers);

//! GET /api/users/:username
usersRouter.get("/:username", getUserByUsername);

module.exports = usersRouter;

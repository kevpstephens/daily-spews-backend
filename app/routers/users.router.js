const express = require("express");
const { getUsers } = require("../controllers/users.controller");

const usersRouter = express.Router();

// GET all users
usersRouter.get("/", getUsers);

module.exports = usersRouter;
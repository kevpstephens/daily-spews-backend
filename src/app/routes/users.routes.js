const express = require("express");
const upload = require("../middleware/multer");
const {
  getUsers,
  getUserByUsername,
  getCurrentUser,
  updateAvatar,
} = require("../controllers/users.controller");
const { verifyToken } = require("../middleware/auth");

const usersRouter = express.Router();

//! GET /api/users
usersRouter.get("/", getUsers);

//! GET /api/users/me (protected)
usersRouter.get("/me", verifyToken, getCurrentUser);

//! GET /api/users/:username
usersRouter.get("/:username", getUserByUsername);

//! POST /api/users/:username/avatar
usersRouter.post("/:username/avatar", upload.single("avatar"), updateAvatar);

module.exports = usersRouter;

import express from "express";
import upload from "../middleware/multer.js";
import {
  getUsers,
  getUserByUsername,
  getCurrentUser,
  updateAvatar,
} from "../controllers/users.controller.js";
import verifyToken from "../middleware/auth.js";

const usersRouter = express.Router();

//! GET /api/users
usersRouter.get("/", getUsers);

//! GET /api/users/me (protected)
usersRouter.get("/me", verifyToken, getCurrentUser);

//! GET /api/users/:username
usersRouter.get("/:username", getUserByUsername);

//! POST /api/users/:username/avatar
usersRouter.post("/:username/avatar", upload.single("avatar"), updateAvatar);

export default usersRouter;

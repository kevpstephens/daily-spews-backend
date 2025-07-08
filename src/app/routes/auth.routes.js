import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  updateUserPassword,
} from "../controllers/auth.controller.js";
import upload from "../middleware/multer.js";

const authRouter = express.Router();

//! POST /api/auth/register
// Use upload.any() to handle optional file uploads and parse all fields
authRouter.post("/register", upload.any(), registerUser);

//! POST /api/auth/login
authRouter.post("/login", loginUser);

//! POST /api/auth/logout
authRouter.post("/logout", logoutUser);

//! PATCH /api/auth/:username/password
authRouter.patch("/:username/password", updateUserPassword);

export default authRouter;

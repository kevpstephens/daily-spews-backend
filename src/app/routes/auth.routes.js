const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
} = require("../controllers/auth.controller");
const upload = require("../middleware/multer");

const authRouter = express.Router();

//! POST /api/auth/register
// Use upload.any() to handle optional file uploads and parse all fields
authRouter.post("/register", upload.any(), registerUser);

//! POST /api/auth/login
authRouter.post("/login", loginUser);

//! POST /api/auth/logout
authRouter.post("/logout", logoutUser);

module.exports = authRouter;

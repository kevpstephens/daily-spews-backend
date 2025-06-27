const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
} = require("../controllers/auth.controller");
const upload = require("../middleware/multer");

const authRouter = express.Router();

//! POST /api/auth/register
authRouter.post("/register", upload.single("avatar"), registerUser);

//! POST /api/auth/login
authRouter.post("/login", loginUser);

//! POST /api/auth/logout
authRouter.post("/logout", logoutUser);

module.exports = authRouter;

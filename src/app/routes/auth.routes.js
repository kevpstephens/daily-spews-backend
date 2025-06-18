const express = require("express");
const { registerUser, loginUser, logoutUser } = require("../controllers/auth.controller");

const authRouter = express.Router();

//! POST /api/auth/register
authRouter.post("/register", registerUser);

//! POST /api/auth/login
authRouter.post("/login", loginUser);

//! POST /api/auth/logout
authRouter.post("/logout", logoutUser);

module.exports = authRouter;

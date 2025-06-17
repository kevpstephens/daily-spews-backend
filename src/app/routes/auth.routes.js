const express = require("express");
const { registerUser, loginUser } = require("../controllers/auth.controller");

const authRouter = express.Router();

//! POST /api/auth/register
authRouter.post("/register", registerUser);

//! POST /api/auth/login
authRouter.post("/login", loginUser);

module.exports = authRouter;
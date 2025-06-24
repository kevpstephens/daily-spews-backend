const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { insertUser, selectUserByEmail } = require("../models/users.model");

//! POST /api/auth/register
exports.registerUser = async (req, res, next) => {
  const { username, name, email, password, avatar_url } = req.body;

  let avatar = avatar_url;
  if (!avatar_url || avatar_url.trim() === "") {
    avatar = "https://daily-spews-api.onrender.com/images/default-profile.png";
  }

  try {
    // Hash the password
    const password_hash = await bcrypt.hash(password, 10);
    const user = await insertUser({
      username,
      name,
      email: email.toLowerCase(),
      password_hash,
      avatar_url: avatar,
    });
    res.status(201).send({ user });
  } catch (err) {
    next(err);
  }
};

//! POST /api/auth/login
exports.loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send({ msg: "Missing email or password!" });
  }

  if (typeof email !== "string" || typeof password !== "string") {
    return res.status(400).send({ msg: "Invalid email or password format!" });
  }

  try {
    // Check if the user exists
    const user = await selectUserByEmail(email.toLowerCase());
    if (!user)
      return res.status(401).send({ msg: "Invalid email or password!" });

    // Check if the password is correct
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid)
      return res.status(401).send({ msg: "Invalid email or password!" });

    // Generate a token
    const token = jwt.sign(
      { username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Remove the password hash from the user object
    const { password_hash, ...rest } = user;
    const safeUser = {
      ...rest,
      email: user.email.toLowerCase(),
    };

    // Set the token as a secure httpOnly cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      maxAge: 3600000, // 1 hour
    });

    // Respond with user data only
    res.send({ user: safeUser });
  } catch (err) {
    next(err);
  }
};

//! POST /api/auth/logout
exports.logoutUser = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax",
  });
  res.status(200).send({ msg: "Logged out successfully!" });
};

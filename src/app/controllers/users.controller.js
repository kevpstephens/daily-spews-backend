const { uploadUserAvatar } = require("../../utils/supabaseClient");
const {
  selectAllUsers,
  selectUserByUsername,
  updateUserAvatar,
} = require("../models/users.model");

//! GET /api/users
exports.getUsers = async (req, res, next) => {
  try {
    const users = await selectAllUsers();
    res.status(200).send({ users });
  } catch (err) {
    next(err);
  }
};

//! GET /api/users/me (protected) - DEBUG VERSION
exports.getCurrentUser = async (req, res, next) => {
  try {
    console.log("🔍 getCurrentUser called");
    console.log("🔍 req.user:", req.user);
    console.log("🔍 req.cookies:", req.cookies);

    if (!req.user || !req.user.username) {
      console.log("❌ No username in req.user");
      return res.status(401).send({ msg: "No user data in token" });
    }

    console.log("🔍 Looking for user:", req.user.username);
    const user = await selectUserByUsername(req.user.username);
    console.log("🔍 Found user:", user ? "YES" : "NO");

    // Remove password_hash from response
    const { password_hash, ...safeUser } = user;

    res.status(200).send({ user: safeUser });
  } catch (err) {
    console.error("❌ getCurrentUser error:", err);
    next(err);
  }
};

//! GET /api/users/:username
exports.getUserByUsername = async (req, res, next) => {
  const { username } = req.params;

  try {
    const user = await selectUserByUsername(username);
    res.status(200).send({ user });
  } catch (err) {
    next(err);
  }
};

//! POST /api/users/:username/avatar
exports.updateAvatar = async (req, res, next) => {
  const { username } = req.params;

  if (!req.file) {
    return res.status(400).send({ msg: "No file uploaded." });
  }

  try {
    const file = req.file;
    const uploadPath = `avatars/${username}/${Date.now()}-${file.originalname}`;

    const { publicUrl, error } = await uploadUserAvatar(uploadPath, file);

    if (error) {
      throw error;
    }

    const updatedUser = await updateUserAvatar(username, publicUrl);

    res.status(200).send({ user: updatedUser });
  } catch (err) {
    console.error("❌ Avatar upload failed:", err);
    next(err);
  }
};

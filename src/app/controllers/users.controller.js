import { uploadUserAvatar } from "../../utils/supabaseClient.js";
import {
  selectAllUsers,
  selectUserByUsername,
  updateUserAvatar,
} from "../models/users.model.js";
import logger from "../../utils/logger.js";

//! GET /api/users
export const getUsers = async (req, res, next) => {
  try {
    const users = await selectAllUsers();
    return res.status(200).send({ users });
  } catch (err) {
    return next(err);
  }
};

//! GET /api/users/me (protected)
export const getCurrentUser = async (req, res, next) => {
  try {
    logger.info("getCurrentUser called", {
      hasUser: !!req.user,
      hasUsername: !!(req.user && req.user.username),
    });

    if (!req.user || !req.user.username) {
      logger.warn("No username in req.user");
      return res.status(401).send({ msg: "No user data in token" });
    }

    logger.info("Looking for user:", req.user.username);
    const user = await selectUserByUsername(req.user.username);

    if (!user) {
      logger.warn("User not found:", req.user.username);
      return res.status(404).send({ msg: "User not found" });
    }

    logger.info("User found successfully");

    // Remove sensitive data before sending to client
    const { password_hash, ...safeUser } = user;

    return res.status(200).send({ user: safeUser });
  } catch (err) {
    logger.error("getCurrentUser error:", err);
    return next(err);
  }
};

//! GET /api/users/:username
export const getUserByUsername = async (req, res, next) => {
  const { username } = req.params;

  try {
    const user = await selectUserByUsername(username);
    return res.status(200).send({ user });
  } catch (err) {
    return next(err);
  }
};

//! POST /api/users/:username/avatar
export const updateAvatar = async (req, res, next) => {
  const { username } = req.params;

  if (!req.file) {
    return res.status(400).send({ msg: "No file uploaded." });
  }

  try {
    const { file } = req;

    // Create unique path to prevent file name conflicts
    const uploadPath = `avatars/${username}/${Date.now()}-${file.originalname}`;

    const { publicUrl, error } = await uploadUserAvatar(uploadPath, file);

    if (error) {
      throw error;
    }

    const updatedUser = await updateUserAvatar(username, publicUrl);

    return res.status(200).send({ user: updatedUser });
  } catch (err) {
    logger.error("Avatar upload failed:", err);
    return next(err);
  }
};

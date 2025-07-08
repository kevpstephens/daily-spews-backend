import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  insertUser,
  selectUserByEmail,
  updateUserPasswordByUsername,
} from "../models/users.model.js";
import uploadToSupabase from "../../utils/uploadToSupabase.js";
import logger from "../../utils/logger.js";

//! POST /api/auth/register
export const registerUser = async (req, res, next) => {
  logger.info("Registration attempt started");
  logger.info("Request details", {
    hasFiles: !!req.files,
    hasFile: !!req.file,
    bodyKeys: Object.keys(req.body),
  });

  const { username, name, email, password, avatar_url } = req.body;
  let avatar = avatar_url;

  try {
    // Find avatar file from req.files array (when using upload.any())
    const avatarFile =
      req.files && req.files.find((file) => file.fieldname === "avatar");

    // Also check req.file for backward compatibility
    const fileToUpload = avatarFile || req.file;

    if (fileToUpload) {
      logger.info("Attempting to upload file to Supabase");
      logger.info("File details", {
        fieldname: fileToUpload.fieldname,
        originalname: fileToUpload.originalname,
        mimetype: fileToUpload.mimetype,
        size: fileToUpload.size,
      });

      try {
        // Create the correct object structure for uploadToSupabase
        const fileData = {
          buffer: fileToUpload.buffer,
          mimetype: fileToUpload.mimetype,
        };

        // Upload to avatars bucket
        avatar = await uploadToSupabase(fileData, "avatars");
        logger.info("File uploaded successfully", { avatar });
      } catch (uploadErr) {
        logger.error("Error uploading avatar to Supabase", {
          message: uploadErr.message,
          stack: uploadErr.stack,
        });

        // Continue with default avatar instead of failing registration
        logger.info("Continuing with default avatar due to upload failure");
        avatar =
          "https://daily-spews-api.onrender.com/images/default-profile.png";
      }
    }

    // Fallback to default image if neither file nor valid string provided
    if (!avatar || avatar.trim() === "") {
      logger.info("Using default avatar");
      avatar =
        "https://daily-spews-api.onrender.com/images/default-profile.png";
    }

    logger.info("Final avatar URL", { avatar });

    if (!username || !name || !email || !password) {
      logger.warn("Missing required fields", {
        hasUsername: !!username,
        hasName: !!name,
        hasEmail: !!email,
        hasPassword: !!password,
      });
      return res.status(400).send({ msg: "Missing required fields!" });
    }

    logger.info("Hashing password");
    const password_hash = await bcrypt.hash(password, 10);

    logger.info("Attempting to insert user into database");
    const user = await insertUser({
      username,
      name,
      email: email.toLowerCase(),
      password_hash,
      avatar_url: avatar,
    });

    logger.info("User created successfully", { username: user.username });
    return res.status(201).send({ user });
  } catch (err) {
    logger.error("Registration error", err);

    // Handle specific database errors
    if (err.code === "23505") {
      // PostgreSQL unique constraint violation
      if (err.constraint === "users_username_key") {
        return res.status(409).send({ msg: "Username already exists!" });
      }
      if (err.constraint === "users_email_key") {
        return res.status(409).send({ msg: "Email already exists!" });
      }
    }

    return next(err);
  }
};

//! POST /api/auth/login
export const loginUser = async (req, res, next) => {
  logger.info("Login attempt started");
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send({ msg: "Missing email or password!" });
  }

  if (typeof email !== "string" || typeof password !== "string") {
    return res.status(400).send({ msg: "Invalid email or password format!" });
  }

  try {
    logger.info("Looking up user by email");
    const user = await selectUserByEmail(email.toLowerCase());

    if (!user) {
      logger.warn("Login failed - user not found", { email });
      return res.status(401).send({ msg: "Invalid email or password!" });
    }

    logger.info("Verifying password");
    const valid = await bcrypt.compare(password, user.password_hash);

    if (!valid) {
      logger.warn("Login failed - invalid password", { email });
      return res.status(401).send({ msg: "Invalid email or password!" });
    }

    const token = jwt.sign(
      { username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );

    // Remove the password hash from the user object
    const { password_hash, ...rest } = user;
    const safeUser = {
      ...rest,
      email: user.email.toLowerCase(),
    };

    // Set the token as a secure httpOnly cookie
    res.cookie("token", token, {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 3600000, // 1 hour
    });

    logger.info("Login successful", { username: user.username });
    return res.send({ user: safeUser });
  } catch (err) {
    logger.error("Login error", err);
    return next(err);
  }
};

//! POST /api/auth/logout
export const logoutUser = (req, res, next) => {
  logger.info("Logging out user");
  try {
    res.clearCookie("token", {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    });

    return res.status(200).send({ msg: "Logged out successfully!" });
  } catch (err) {
    logger.error("Logout error", err);
    return next(err);
  }
};

//! PATCH /api/auth/:username/password
export const updateUserPassword = async (req, res, next) => {
  const { username } = req.params;
  const { newPassword } = req.body;

  if (!newPassword || typeof newPassword !== "string") {
    return res
      .status(400)
      .send({ msg: "New password is required and must be a string" });
  }

  try {
    const hashed = await bcrypt.hash(newPassword, 10);
    const updatedUser = await updateUserPasswordByUsername(username, hashed);

    return res
      .status(200)
      .send({ msg: `Password updated for ${updatedUser.username}` });
  } catch (err) {
    logger.error("Password update error", err);
    return next(err);
  }
};

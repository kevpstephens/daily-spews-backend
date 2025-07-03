const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  insertUser,
  selectUserByEmail,
  updateUserPassword,
} = require("../models/users.model");
const uploadToSupabase = require("../../utils/uploadToSupabase");

//! POST /api/auth/register
exports.registerUser = async (req, res, next) => {
  console.log("🔍 Registration attempt started");
  console.log("🔍 req.files:", req.files);
  console.log("🔍 req.file:", req.file);
  console.log("🔍 req.body:", req.body);
  console.log("🔍 req.body keys:", Object.keys(req.body));

  const { username, name, email, password, avatar_url } = req.body;
  let avatar = avatar_url;

  try {
    // Find avatar file from req.files array (when using upload.any())
    const avatarFile =
      req.files && req.files.find((file) => file.fieldname === "avatar");

    // Also check req.file for backward compatibility
    const fileToUpload = avatarFile || req.file;

    // Upload avatar if a file is provided
    if (fileToUpload) {
      console.log("🔍 Attempting to upload file to Supabase...");
      console.log("🔍 File details:", {
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
        console.log("✅ File uploaded successfully:", avatar);
      } catch (uploadErr) {
        console.error("❌ Error uploading avatar to Supabase:", uploadErr);
        console.error("❌ Upload error details:", {
          message: uploadErr.message,
          stack: uploadErr.stack,
        });

        // Continue with default avatar instead of failing registration
        console.log("🔄 Continuing with default avatar due to upload failure");
        avatar =
          "https://daily-spews-api.onrender.com/images/default-profile.png";
      }
    }

    // Fallback to default image if neither file nor valid string provided
    if (!avatar || avatar.trim() === "") {
      console.log("🔄 Using default avatar");
      avatar =
        "https://daily-spews-api.onrender.com/images/default-profile.png";
    }

    console.log("🔍 Final avatar URL:", avatar);

    // Validate required fields
    if (!username || !name || !email || !password) {
      console.log("❌ Missing required fields");
      console.log("🔍 username:", username);
      console.log("🔍 name:", name);
      console.log("🔍 email:", email);
      console.log("🔍 password:", password ? "Present" : "Missing");
      return res.status(400).send({ msg: "Missing required fields!" });
    }

    // Hash the password
    console.log("🔍 Hashing password...");
    const password_hash = await bcrypt.hash(password, 10);

    console.log("🔍 Attempting to insert user into database...");
    const user = await insertUser({
      username,
      name,
      email: email.toLowerCase(),
      password_hash,
      avatar_url: avatar,
    });

    console.log("✅ User created successfully:", user.username);
    res.status(201).send({ user });
  } catch (err) {
    console.error("❌ Registration error:", err);

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

    next(err);
  }
};

//! POST /api/auth/login
exports.loginUser = async (req, res, next) => {
  console.log("🔐 Login route hit");
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send({ msg: "Missing email or password!" });
  }

  if (typeof email !== "string" || typeof password !== "string") {
    return res.status(400).send({ msg: "Invalid email or password format!" });
  }

  try {
    console.log("Email received:", email);
    // Check if the user exists
    const user = await selectUserByEmail(email.toLowerCase());
    console.log("User found:", user);
    if (!user)
      return res.status(401).send({ msg: "Invalid email or password!" });

    console.log("Checking password...");
    // Check if the password is correct
    const valid = await bcrypt.compare(password, user.password_hash);
    console.log("Password valid:", valid);
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
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? true : false,
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 3600000, // 1 hour
    });

    console.log("Login successful, sending response...");
    // Respond with user data only
    res.send({ user: safeUser });
  } catch (err) {
    console.error("❌ Login error:", err);
    next(err);
  }
};

//! POST /api/auth/logout
exports.logoutUser = (req, res, next) => {
  console.log("🔓 Logging out, clearing token cookie...");
  try {
    res.clearCookie("token", {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? true : false,
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    });

    res.status(200).send({ msg: "Logged out successfully!" });
  } catch (err) {
    console.error("❌ Logout error:", err);
    next(err);
  }
};

//! PATCH /api/auth/:username/password
exports.updateUserPassword = async (req, res, next) => {
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

    res
      .status(200)
      .send({ msg: `Password updated for ${updatedUser.username}` });
  } catch (err) {
    console.error("❌ Password update error:", err);
    next(err);
  }
};

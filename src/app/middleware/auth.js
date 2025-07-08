/* ============================================================ 
  JWT Token Verification Middleware

  Verifies JWT tokens from cookies (primary) or Authorization header (fallback).
  Attaches decoded user information to req.user for downstream middleware.

  Token Sources (in order of preference):
    1. HTTP-only cookie (more secure for web apps)
    2. Authorization header with Bearer token (for API clients)
 ============================================================ */

import jwt from "jsonwebtoken";
import logger from "../../utils/logger.js";

export default function verifyToken(req, res, next) {
  try {
    // Extract token from cookie (primary method for web clients)
    const cookieToken = req.cookies?.token;

    // Extract token from Authorization header (fallback for API clients)
    const authHeader = req.headers.authorization;
    const bearerToken =
      authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : null;

    // Use cookie token if available, otherwise fallback to Bearer token
    const jwtToken = cookieToken || bearerToken;

    // Reject requests without any token
    if (!jwtToken) {
      logger.warn("Authentication failed: No token provided", {
        ip: req.ip,
        userAgent: req.get("User-Agent"),
        path: req.path,
      });
      return res.status(401).send({ msg: "Missing or malformed token!" });
    }

    // Verify and decode the JWT token
    const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET);

    // Attach user information to request object
    req.user = decoded;

    // Log successful authentication (optional - can be removed if too verbose)
    logger.info("User authenticated successfully", {
      username: decoded.username,
      path: req.path,
    });

    return next();
  } catch (err) {
    // Handle JWT verification errors
    logger.error("Authentication failed: Invalid token", {
      error: err.message,
      ip: req.ip,
      userAgent: req.get("User-Agent"),
      path: req.path,
    });

    return res.status(401).send({ msg: "Invalid or expired token!" });
  }
}

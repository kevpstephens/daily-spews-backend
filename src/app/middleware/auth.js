const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  // 1. Check for token in cookie
  const token = req.cookies?.token;

  // 2. Fallback: Check for token in Authorization header
  const authHeader = req.headers.authorization;
  const headerToken =
    authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

  // Use cookie token if present, otherwise fallback
  const jwtToken = token || headerToken;

  if (!jwtToken) {
    return res.status(401).send({ msg: "Missing or malformed token!" });
  }

  try {
    const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).send({ msg: "Invalid or expired token!" });
  }
};

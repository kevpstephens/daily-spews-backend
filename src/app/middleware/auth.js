const jwt = require("jsonwebtoken");

//! Verify the token
exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check if the Authorization header is present and starts with "Bearer "
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).send({ msg: "Missing or malformed token!" });
  }

  // Get the token from the Authorization header
  const token = authHeader.split(" ")[1];

  // Verify the token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Add the user to the request object
    req.user = decoded;
    // Call the next middleware
    next();
  } catch (err) {
    // Send an error response if the token is invalid or expired
    res.status(401).send({ msg: "Invalid or expired token!" });
  }
};

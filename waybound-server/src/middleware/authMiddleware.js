const jwt = require("jsonwebtoken");
const User = require("../models/User");

async function protect(req, res, next) {
  try {
    // Check if Authorization header exists
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Not authorised. No token provided." });
    }

    // Extract the token
    const token = authHeader.split(" ")[1];

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user from the token
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ error: "Not authorised. User not found." });
    }

    // Attach user to request
    req.user = user;
    next();

  } catch (error) {
    console.error("Auth middleware error:", error.message);
    res.status(401).json({ error: "Not authorised. Invalid token." });
  }
}

module.exports = { protect };
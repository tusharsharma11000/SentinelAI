const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && (authHeader.startsWith("Bearer ") ? authHeader.substring(7) : authHeader);

    if (!token) {
      return res.status(401).json({ error: "Access Denied. Authorization token missing." });
    }

    const secret = process.env.JWT_SECRET || "sentinelai_secret_hud";
    const decoded = jwt.verify(token, secret);
    
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ error: "Access Denied. User record no longer exists." });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("JWT Verification failed:", error.message);
    res.status(401).json({ error: "Access Denied. Invalid or expired token." });
  }
};

module.exports = authMiddleware;

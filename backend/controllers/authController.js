const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// JWT signature generator helper
const generateToken = (userId) => {
  const secret = process.env.JWT_SECRET || "sentinelai_secret_hud";
  return jwt.sign({ id: userId }, secret, { expiresIn: "7d" });
};

// @desc    Register a new commander account
// @route   POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Please enter all required commander fields" });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: "Email is already registered in surveillance registry" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "commander"
    });

    const token = generateToken(user._id);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error("Register controller failure:", error.message);
    res.status(500).json({ error: "Commander database insertion failed" });
  }
};

// @desc    Authenticate commander credentials & return token
// @route   POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Please provide both email and passcode" });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid commander credentials" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid commander credentials" });
    }

    const token = generateToken(user._id);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error("Login controller failure:", error.message);
    res.status(500).json({ error: "Commander authentication failed" });
  }
};

// @desc    Retrieve logged user profile metadata
// @route   GET /api/auth/profile
exports.profile = async (req, res) => {
  try {
    // req.user is populated by authMiddleware
    res.json(req.user);
  } catch (error) {
    res.status(500).json({ error: "Failed to gather commander telemetry" });
  }
};

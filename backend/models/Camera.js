const mongoose = require("mongoose");

const CameraSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  status: { type: String, enum: ["active", "offline"], default: "active" },
  resolution: { type: String, default: "1080p" },
  fps: { type: Number, default: 60 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Camera", CameraSchema);

const mongoose = require("mongoose");

const AlertSchema = new mongoose.Schema({
  cameraId: { type: mongoose.Schema.Types.ObjectId, ref: "Camera", required: true },
  object: { type: String, required: true }, // e.g., "Person", "Vehicle", "Drone", "Animal"
  confidence: { type: Number, required: true }, // Float between 0.0 and 1.0 (or percentage)
  time: { type: Date, default: Date.now },
  threatLevel: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },
  status: { type: String, enum: ["critical", "pending", "resolved"], default: "pending" },
  image: { type: String } // Path to visual snapshot URL or local file upload
});

module.exports = mongoose.model("Alert", AlertSchema);

const mongoose = require("mongoose");

const DetectionSchema = new mongoose.Schema({
  camera: { type: String, required: true }, // e.g., "Sector Alpha-12 (North)"
  className: { type: String, required: true }, // e.g., "Person", "Drone", "Vehicle"
  confidence: { type: Number, required: true },
  time: { type: Date, default: Date.now },
  image: { type: String }, // Base64 snapshot string
  trackingId: { type: Number, required: true },
  location: { type: String }, // Coordinates string
  status: { type: String, enum: ["active", "resolved"], default: "active" }
});

module.exports = mongoose.model("Detection", DetectionSchema);

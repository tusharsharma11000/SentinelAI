const mongoose = require("mongoose");

const DetectionSchema = new mongoose.Schema({
  object: { type: String, required: true }, // e.g. "person", "dog", "car"
  confidence: { type: Number, required: true },
  camera: { type: String, required: true }, // e.g. "Camera 01"
  timestamp: { type: Date, default: Date.now },
  alertLevel: { type: String, required: true }, // e.g. "HIGH ALERT", "MEDIUM", "LOW"
  
  // Optional parameters to support Day 5 tracking layout overlays
  image: { type: String },
  trackingId: { type: Number }
});

module.exports = mongoose.model("Detection", DetectionSchema);

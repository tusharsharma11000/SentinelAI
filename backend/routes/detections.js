const express = require("express");
const router = express.Router();
const Detection = require("../models/Detection");
const Alert = require("../models/Alert");
const Camera = require("../models/Camera");

// GET /api/detections
router.get("/", async (req, res) => {
  try {
    const response = await fetch("http://localhost:8000/detections");
    if (!response.ok) {
      return res.status(response.status).json({ error: "Failed to fetch detections from AI service" });
    }
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("AI Service connection error:", error.message);
    res.status(500).json({ error: "AI service offline" });
  }
});

// POST /api/detections/event
// Received real-time events pushed by Python YOLOv8 engine
router.post("/event", async (req, res) => {
  try {
    const { camera, className, confidence, trackingId, location, image, speed, direction, restrictedZoneBreach } = req.body;

    // 1. Save Detection log to MongoDB
    const detection = await Detection.create({
      camera,
      className,
      confidence,
      time: new Date(),
      image,
      trackingId,
      location,
      status: "active"
    });

    // 2. Broadcast Detection event via Socket.io
    const io = req.app.get("io");
    io.emit("new-detection", {
      ...detection.toJSON(),
      speed,
      direction,
      restrictedZoneBreach
    });

    // 3. Auto-generate Alert if object is high-threat or breaches Restricted Zone (Phase Real-time Alerts)
    const isHighThreat = ["drone", "unknown object", "unknown"].includes(className.toLowerCase());
    if (isHighThreat || restrictedZoneBreach) {
      // Find matching camera in database to link alert cameraId
      let matchedCam = await Camera.findOne({ name: new RegExp(camera, "i") });
      if (!matchedCam) {
        // Fallback create dummy camera
        matchedCam = await Camera.create({ name: camera, location: location || "32.784° N, 104.982° W" });
      }

      const threatLevel = isHighThreat ? "High" : (restrictedZoneBreach ? "High" : "Medium");
      
      const alert = await Alert.create({
        cameraId: matchedCam._id,
        object: className,
        confidence,
        threatLevel,
        status: "critical",
        image,
        time: new Date()
      });

      const populatedAlert = await Alert.findById(alert._id).populate("cameraId", "name location");

      // Broadcast alert event to trigger toasts on React frontend
      io.emit("new-alert", populatedAlert);
    }

    res.status(201).json({ message: "Telemetry event processed successfully", detectionId: detection._id });
  } catch (error) {
    console.error("Failed to process AI telemetry event:", error.message);
    res.status(400).json({ error: "Failed to store surveillance event" });
  }
});

module.exports = router;

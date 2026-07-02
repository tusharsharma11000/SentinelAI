const express = require("express");
const router = express.Router();
const Detection = require("../models/Detection");
const Alert = require("../models/Alert");
const Camera = require("../models/Camera");

const authMiddleware = require("../middleware/authMiddleware");

const historyController = require("../controllers/historyController");

// GET /api/detections
router.get("/", authMiddleware, historyController.getHistory);

// POST /api/detections/event
// Received real-time events pushed by Python YOLOv8 engine
router.post("/event", async (req, res) => {
  try {
    const { camera, className, confidence, trackingId, location, image, speed, direction, restrictedZoneBreach } = req.body;

    // Compute Alert Level based on Phase 7 Alert Logic:
    // - Person with confidence > 90% -> HIGH ALERT
    // - Person other confidence -> MEDIUM
    // - Animals (dog, cat, bird, etc.) -> LOW
    // - Others -> MEDIUM (drones, vehicles, etc.)
    let alertLevel = "MEDIUM";
    const lowerClass = className.toLowerCase();
    
    if (lowerClass === "person") {
      alertLevel = confidence > 0.90 ? "HIGH ALERT" : "MEDIUM";
    } else if (["dog", "cat", "bird", "horse", "sheep", "cow", "elephant", "bear", "zebra", "giraffe"].includes(lowerClass)) {
      alertLevel = "LOW";
    }

    // Retrieve active commander from database (Phase 10 AI Detection Ownership)
    const User = require("../models/User");
    let commanderUser = await User.findOne({ role: "commander" });
    if (!commanderUser) {
      commanderUser = await User.findOne();
    }

    // 1. Save Detection log to MongoDB matching exact schema
    const detection = await Detection.create({
      object: className,
      confidence: confidence,
      camera: camera || "Camera 01",
      timestamp: new Date(),
      alertLevel: alertLevel,
      image,
      trackingId,
      userId: commanderUser ? commanderUser._id : null
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

const express = require("express");
const router = express.Router();
const Detection = require("../models/Detection");

// GET /api/ai/status
// Forwards query to Flask root route to verify YOLO server is live
router.get("/status", async (req, res) => {
  try {
    const response = await fetch("http://localhost:8000/", { signal: AbortSignal.timeout(2000) });
    if (!response.ok) {
      return res.json({ status: "offline", message: "AI service returned error response" });
    }
    const data = await response.json();
    res.json({ status: "online", details: data });
  } catch (error) {
    res.json({ status: "offline", message: "Flask AI service is unreachable" });
  }
});

// GET /api/ai/detect
// Instructs Flask to initialize live camera object detection loop
router.get("/detect", async (req, res) => {
  try {
    const response = await fetch("http://localhost:8000/detect");
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(502).json({ error: "Failed to trigger live camera detection. Check if Flask is running on port 8000." });
  }
});

// GET /api/ai/results
// Returns historical YOLO detection log entries saved in MongoDB
router.get("/results", async (req, res) => {
  try {
    const history = await Detection.find().sort({ timestamp: -1 }).limit(50);
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve detection history logs" });
  }
});

module.exports = router;

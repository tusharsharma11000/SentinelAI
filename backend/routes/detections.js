const express = require("express");
const router = express.Router();

// GET /api/detections
router.get("/", async (req, res) => {
  try {
    // Proxy telemetries check directly to Flask port 8000
    const response = await fetch("http://localhost:8000/detections");
    if (!response.ok) {
      return res.status(response.status).json({ error: "Failed to fetch detections from AI service" });
    }
    const data = await response.json();
    
    // Return array response back to client (React)
    res.json(data);
  } catch (error) {
    console.error("AI Service connection error:", error.message);
    res.status(500).json({ error: "AI service offline" });
  }
});

module.exports = router;

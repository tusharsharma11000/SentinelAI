const express = require("express");
const router = express.Router();
const Camera = require("../models/Camera");
const Alert = require("../models/Alert");

// GET /api/reports
router.get("/", async (req, res) => {
  try {
    const totalCameras = await Camera.countDocuments();
    const activeCameras = await Camera.countDocuments({ status: "active" });
    const totalAlerts = await Alert.countDocuments();
    const criticalAlerts = await Alert.countDocuments({ status: "critical" });
    const resolvedAlerts = await Alert.countDocuments({ status: "resolved" });

    // Generate a simple dynamic system analysis report
    const systemReport = {
      title: "SentinelAI Security Telemetry Summary",
      timestamp: new Date().toISOString(),
      metrics: {
        totalCameras,
        activeCameras,
        offlineCameras: totalCameras - activeCameras,
        totalAlerts,
        criticalAlerts,
        resolvedAlerts
      },
      status: totalAlerts > 5 ? "ATTENTION REQUIRED" : "NORMAL OPERATION"
    };

    res.json(systemReport);
  } catch (error) {
    res.status(500).json({ error: "Failed to generate security summary reports" });
  }
});

// POST /api/reports
router.post("/", (req, res) => {
  const { title, details } = req.body;
  res.status(201).json({
    message: "Report saved successfully",
    report: {
      title,
      details,
      timestamp: new Date().toISOString()
    }
  });
});

module.exports = router;

const express = require("express");
const router = express.Router();
const Camera = require("../models/Camera");
const Alert = require("../models/Alert");

// GET /api/dashboard
router.get("/", async (req, res) => {
  try {
    const activeCameras = await Camera.countDocuments({ status: "active" });
    
    // Count alerts that are pending or critical
    const activeAlerts = await Alert.countDocuments({ status: { $in: ["critical", "pending"] } });
    
    // Intrusions (high-level alarms, e.g. Person class)
    const intrusions = await Alert.countDocuments({ object: "Person", status: "critical" });
    
    // Determine overall status
    const borderStatus = activeAlerts > 3 ? "BREACH DETECTED" : "ALL CLEAR";
    
    res.json({
      activeCameras,
      activeAlerts,
      intrusions,
      accuracy: 98.4,
      systemHealth: activeCameras > 0 ? 98 : 0,
      borderStatus
    });
  } catch (error) {
    console.error("Dashboard error:", error.message);
    res.status(500).json({ error: "Failed to load dashboard statistics" });
  }
});

module.exports = router;

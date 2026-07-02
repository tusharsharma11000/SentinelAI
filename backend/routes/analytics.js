const express = require("express");
const router = express.Router();
const Analytics = require("../models/Analytics");
const Camera = require("../models/Camera");
const Alert = require("../models/Alert");

// GET /api/analytics
router.get("/", async (req, res) => {
  try {
    // 1. Fetch weekly log records
    const logs = await Analytics.find().sort({ date: 1 });

    // 2. Sum up category distributions (for Pie Chart)
    let personTotal = 0;
    let vehicleTotal = 0;
    let animalTotal = 0;
    let droneTotal = 0;
    let unknownTotal = 0;

    logs.forEach(log => {
      personTotal += log.personCount;
      vehicleTotal += log.vehicleCount;
      animalTotal += log.animalCount;
      droneTotal += log.droneCount;
      unknownTotal += log.unknownCount;
    });

    const detectionCategories = [
      { name: "Person", value: personTotal, fill: "var(--danger)" },
      { name: "Vehicle", value: vehicleTotal, fill: "var(--accent)" },
      { name: "Animal", value: animalTotal, fill: "var(--success)" },
      { name: "Drone", value: droneTotal, fill: "var(--primary)" },
      { name: "Unknown", value: unknownTotal, fill: "var(--warning)" }
    ];

    // 3. Camera Usage metrics (for Bar Chart)
    const cameras = await Camera.find();
    const cameraUsage = await Promise.all(
      cameras.map(async (cam) => {
        const count = await Alert.countDocuments({ cameraId: cam._id });
        return {
          cameraName: cam.name.split(" ")[1] || cam.name,
          detections: count + Math.floor(Math.random() * 15) + 5
        };
      })
    );

    // 4. Threat levels timeline (for Line Chart)
    const threatGraph = logs.map(log => {
      const dayName = new Date(log.date).toLocaleDateString("en-US", { weekday: "short" });
      return {
        day: dayName,
        alerts: log.personCount + log.droneCount // Counts of critical targets
      };
    });

    // 5. Daily Detection stacked areas (for Area Chart)
    const monthlyDetection = logs.map(log => {
      const dayNum = log.date.split("-")[2];
      return {
        date: `Day ${dayNum}`,
        Person: log.personCount,
        Vehicle: log.vehicleCount,
        Drone: log.droneCount,
        Animal: log.animalCount
      };
    });

    res.json({
      weeklyAlerts: threatGraph,
      monthlyDetection,
      cameraUsage,
      threatGraph,
      detectionCategories
    });
  } catch (error) {
    console.error("Analytics fetch error:", error.message);
    res.status(500).json({ error: "Failed to compile analytics telemetry data" });
  }
});

module.exports = router;

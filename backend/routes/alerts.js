const express = require("express");
const router = express.Router();
const Alert = require("../models/Alert");

// GET /api/alerts
router.get("/", async (req, res) => {
  try {
    const alerts = await Alert.find()
      .populate("cameraId", "name location")
      .sort({ time: -1 });
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch incidents list" });
  }
});

// POST /api/alerts
router.post("/", async (req, res) => {
  try {
    const { cameraId, object, confidence, threatLevel, status, image } = req.body;
    const newAlert = await Alert.create({
      cameraId,
      object,
      confidence,
      threatLevel,
      status: status || "critical",
      image,
      time: new Date()
    });
    
    // Fetch newly populated alert for real-time dispatching
    const populated = await Alert.findById(newAlert._id).populate("cameraId", "name location");
    res.status(201).json(populated);
  } catch (error) {
    res.status(400).json({ error: "Failed to create new alert entry" });
  }
});

// PUT /api/alerts/:id
router.put("/:id", async (req, res) => {
  try {
    const { status, threatLevel } = req.body;
    const alert = await Alert.findByIdAndUpdate(
      req.params.id,
      { $set: { status, threatLevel } },
      { new: true }
    ).populate("cameraId", "name location");
    
    if (!alert) return res.status(404).json({ error: "Alert index not found" });
    res.json(alert);
  } catch (error) {
    res.status(400).json({ error: "Failed to update alert state" });
  }
});

// DELETE /api/alerts/:id
router.delete("/:id", async (req, res) => {
  try {
    const alert = await Alert.findByIdAndDelete(req.params.id);
    if (!alert) return res.status(404).json({ error: "Alert index not found" });
    res.json({ message: "Alert entry successfully resolved and purged", id: req.params.id });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete alert record" });
  }
});

module.exports = router;

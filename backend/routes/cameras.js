const express = require("express");
const router = express.Router();
const Camera = require("../models/Camera");

// GET /api/camera/all
router.get("/all", async (req, res) => {
  try {
    const cameras = await Camera.find().sort({ createdAt: -1 });
    res.json(cameras);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch cameras list" });
  }
});

// GET /api/camera/live
router.get("/live", async (req, res) => {
  try {
    const liveCam = await Camera.findOne({ status: "active" });
    res.json(liveCam || { message: "No active live CCTV streams available" });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch active feed" });
  }
});

// GET /api/camera/:id
router.get("/:id", async (req, res) => {
  try {
    const camera = await Camera.findById(req.params.id);
    if (!camera) return res.status(404).json({ error: "Camera not found" });
    res.json(camera);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch camera details" });
  }
});

// POST /api/camera/add
router.post("/add", async (req, res) => {
  try {
    const { name, location, status, resolution, fps } = req.body;
    const newCamera = await Camera.create({
      name,
      location,
      status: status || "active",
      resolution: resolution || "1080p",
      fps: fps || 60
    });
    res.status(201).json(newCamera);
  } catch (error) {
    res.status(400).json({ error: "Failed to register new surveillance camera" });
  }
});

// DELETE /api/camera/:id
router.delete("/:id", async (req, res) => {
  try {
    const camera = await Camera.findByIdAndDelete(req.params.id);
    if (!camera) return res.status(404).json({ error: "Camera not found" });
    res.json({ message: "Camera feed successfully decommissioned", id: req.params.id });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete camera feed" });
  }
});

module.exports = router;

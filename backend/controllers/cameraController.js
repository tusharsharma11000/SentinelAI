const Camera = require("../models/Camera");

// @desc    Retrieve all registered surveillance cameras
// @route   GET /api/camera/all
exports.getCameras = async (req, res) => {
  try {
    const cameras = await Camera.find().sort({ createdAt: -1 });
    res.json(cameras);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch cameras list" });
  }
};

// @desc    Retrieve primary active live camera stream metadata
// @route   GET /api/camera/live
exports.getLiveCamera = async (req, res) => {
  try {
    const liveCam = await Camera.findOne({ status: "active" });
    res.json(liveCam || { message: "No active live CCTV streams available" });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch active feed" });
  }
};

// @desc    Register a new surveillance camera
// @route   POST /api/camera/add
exports.addCamera = async (req, res) => {
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
};

// @desc    Decommission and delete a camera feed
// @route   DELETE /api/camera/:id
exports.deleteCamera = async (req, res) => {
  try {
    const camera = await Camera.findByIdAndDelete(req.params.id);
    if (!camera) return res.status(404).json({ error: "Camera not found" });
    res.json({ message: "Camera feed successfully decommissioned", id: req.params.id });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete camera feed" });
  }
};

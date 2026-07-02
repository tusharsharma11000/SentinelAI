const express = require("express");
const router = express.Router();
const cameraController = require("../controllers/cameraController");

// GET /api/camera/all
router.get("/all", cameraController.getCameras);

// GET /api/camera/live
router.get("/live", cameraController.getLiveCamera);

// POST /api/camera/add
router.post("/add", cameraController.addCamera);

// DELETE /api/camera/:id
router.delete("/:id", cameraController.deleteCamera);

module.exports = router;

const express = require("express");
const router = express.Router();
const reportController = require("../controllers/reportController");

// GET /api/reports
router.get("/", reportController.getReports);

module.exports = router;

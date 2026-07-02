const Detection = require("../models/Detection");

// @desc    Retrieve paginated, searchable, and filterable detection logs
// @route   GET /api/detections
exports.getHistory = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", alertLevel = "", camera = "" } = req.query;

    const query = {};

    // Fuzzy text search by Object or Camera name
    if (search) {
      query.$or = [
        { object: new RegExp(search, "i") },
        { camera: new RegExp(search, "i") }
      ];
    }

    // Exact match filters
    if (alertLevel && alertLevel !== "all") {
      query.alertLevel = alertLevel;
    }

    if (camera && camera !== "all") {
      query.camera = camera;
    }

    const skipIdx = (parseInt(page) - 1) * parseInt(limit);

    const total = await Detection.countDocuments(query);
    const data = await Detection.find(query)
      .sort({ timestamp: -1 })
      .skip(skipIdx)
      .limit(parseInt(limit));

    res.json({
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / parseInt(limit)),
      data
    });
  } catch (error) {
    console.error("History fetch controller failure:", error.message);
    res.status(500).json({ error: "Failed to query system detection history" });
  }
};

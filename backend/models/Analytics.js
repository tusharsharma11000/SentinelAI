const mongoose = require("mongoose");

const AnalyticsSchema = new mongoose.Schema({
  date: { type: String, required: true, unique: true }, // Format: YYYY-MM-DD
  personCount: { type: Number, default: 0 },
  vehicleCount: { type: Number, default: 0 },
  animalCount: { type: Number, default: 0 },
  droneCount: { type: Number, default: 0 },
  unknownCount: { type: Number, default: 0 }
});

module.exports = mongoose.model("Analytics", AnalyticsSchema);

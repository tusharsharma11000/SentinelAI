const Camera = require("../models/Camera");
const Alert = require("../models/Alert");
const Analytics = require("../models/Analytics");

const seedDatabase = async () => {
  try {
    // 1. Seed Cameras
    const cameraCount = await Camera.countDocuments();
    let cameras = [];
    if (cameraCount === 0) {
      console.log("🌱 Database: No cameras found. Seeding default surveillance sectors...");
      cameras = await Camera.create([
        { name: "Sector Alpha-12 (North)", location: "32.784° N, 104.982° W", status: "active", resolution: "1080p", fps: 60 },
        { name: "Sector Bravo-05 (Gate East)", location: "32.788° N, 104.975° W", status: "active", resolution: "720p", fps: 30 },
        { name: "Sector Delta-08 (Canyon)", location: "32.772° N, 104.991° W", status: "active", resolution: "1080p", fps: 60 },
        { name: "Sector Echo-10 (Highway)", location: "32.795° N, 104.960° W", status: "offline", resolution: "1080p", fps: 30 }
      ]);
    } else {
      cameras = await Camera.find();
    }

    // 2. Seed Alerts
    const alertCount = await Alert.countDocuments();
    if (alertCount === 0 && cameras.length > 0) {
      console.log("🌱 Database: No alerts found. Seeding mock incident log history...");
      await Alert.create([
        { cameraId: cameras[0]._id, object: "Person", confidence: 0.98, time: new Date(Date.now() - 600000), threatLevel: "High", status: "critical" },
        { cameraId: cameras[0]._id, object: "Drone", confidence: 0.94, time: new Date(Date.now() - 1200000), threatLevel: "High", status: "critical" },
        { cameraId: cameras[1]._id, object: "Car", confidence: 0.92, time: new Date(Date.now() - 3600000), threatLevel: "Medium", status: "pending" },
        { cameraId: cameras[2]._id, object: "Cat", confidence: 0.87, time: new Date(Date.now() - 7200000), threatLevel: "Low", status: "resolved" },
        { cameraId: cameras[1]._id, object: "Truck", confidence: 0.91, time: new Date(Date.now() - 14400000), threatLevel: "Medium", status: "resolved" },
        { cameraId: cameras[0]._id, object: "Person", confidence: 0.96, time: new Date(Date.now() - 86400000), threatLevel: "High", status: "resolved" }
      ]);
    }

    // 3. Seed Analytics (Past 7 Days)
    const analyticsCount = await Analytics.countDocuments();
    if (analyticsCount === 0) {
      console.log("🌱 Database: No analytics found. Seeding dynamic chart histories...");
      const analyticsData = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split("T")[0]; // YYYY-MM-DD
        
        analyticsData.push({
          date: dateStr,
          personCount: Math.floor(Math.random() * 20) + 5,
          vehicleCount: Math.floor(Math.random() * 15) + 2,
          animalCount: Math.floor(Math.random() * 10) + 1,
          droneCount: Math.floor(Math.random() * 5) + 0,
          unknownCount: Math.floor(Math.random() * 4) + 0
        });
      }
      await Analytics.create(analyticsData);
    }

    console.log("✅ Database Seeding Checked & Initialized");
  } catch (error) {
    console.error("❌ Database Seeding Failed:", error.message);
  }
};

module.exports = seedDatabase;

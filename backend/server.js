const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

connectDB();

const app = express();
const server = http.createServer(app);

// Mount Socket.io server
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Expose io socket server globally to express routes
app.set("io", io);

io.on("connection", (socket) => {
  console.log(`🔌 Control client linked to WebSocket: ${socket.id}`);
  
  socket.on("disconnect", () => {
    console.log(`🔌 Control client disconnected: ${socket.id}`);
  });
});

const helmet = require("helmet");

app.use(helmet());
app.use(cors());
app.use(express.json());

const detectionsRoute = require("./routes/detections");
app.use("/api/detections", detectionsRoute);

const dashboardRoute = require("./routes/dashboard");
const camerasRoute = require("./routes/cameras");
const alertsRoute = require("./routes/alerts");
const reportsRoute = require("./routes/reports");
const analyticsRoute = require("./routes/analytics");
const aiRoute = require("./routes/ai");
const authRoute = require("./routes/authRoutes");
const authMiddleware = require("./middleware/authMiddleware");

app.use("/api/auth", authRoute);
app.use("/api/dashboard", authMiddleware, dashboardRoute);
app.use("/api/camera", authMiddleware, camerasRoute);
app.use("/api/alerts", authMiddleware, alertsRoute);
app.use("/api/reports", authMiddleware, reportsRoute);
app.use("/api/analytics", authMiddleware, analyticsRoute);
app.use("/api/ai", authMiddleware, aiRoute);

app.get("/", (req, res) => {
  res.send("🛡 SentinelAI Backend Running...");
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server Running on Port ${PORT}`);
});
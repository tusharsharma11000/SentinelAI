# 🛡️ SentinelAI - AI Border Surveillance System

SentinelAI is an advanced, premium, real-time AI-powered Border Surveillance System. It utilizes deep learning object detection (YOLOv8) and multi-object tracking (ByteTrack) to identify, track, and alert commanders of intruders (Persons, Drones, Vehicles, and Animals) crossing restricted border sectors.

Designed with high-fidelity glassmorphism HUD interfaces inspired by SpaceX, Tesla, and Apple Vision Pro controls, it coordinates automated web camera feeds, live WebSocket alarm dispatches, vector maps, and CSV/PDF telemetry exports.

---

## 🎯 Problem Statement & Solution

### The Challenge
Modern border defense relies heavily on static CCTV infrastructures that require manual, round-the-clock monitoring. Operators suffer from visual fatigue, leading to missed breaches. Furthermore, traditional cameras lack the ability to estimate intruder speed, heading heading vectors, coordinate tracking IDs, or automatically trigger localized sirens when a boundary wire is crossed.

### The SentinelAI Solution
SentinelAI automates target detections. It processes live camera feeds via YOLOv8, assigns persistent **tracking IDs**, calculates speed vectors, and checks coordinates against an interactive **Restricted Zone polygon**. If a target breaches the polygon, the engine:
1. Saves the detection log in MongoDB.
2. Escalates high-threat triggers as Alerts.
3. Broadcasts alerts over Socket.io, causing commander dashboards to flash red warning borders, queue sliding toast alarms, play sirens, and shake screen consoles.

---

## 🛠️ Technology Stack

| Core | Technologies Used |
| :--- | :--- |
| **Frontend** | React.js, Plain CSS (Frosted Glassmorphic layout), Axios, React Router, Recharts, Framer Motion |
| **Backend** | Node.js, Express.js, Socket.io, Mongoose, JWT, Helmet Secure Headers, BCryptJS |
| **Database** | MongoDB Atlas (NoSQL) |
| **AI Engine** | Python, Ultralytics YOLOv8 (Nano), OpenCV, NumPy, ByteTrack |
| **Tools** | Git, GitHub, VS Code |

---

## 📂 Project Structure

```
SentinelAI/
├── frontend/
│   ├── src/
│   │   ├── components/      # LiveCamera, AlertsTable, RestrictedZone, Timeline, NotificationPanel
│   │   ├── context/         # AuthContext, ThemeContext, DashboardContext
│   │   ├── hooks/           # useDashboard, useCamera, useAlerts, useAnalytics
│   │   ├── pages/           # Dashboard, Login, Register, History, Reports, Cameras, Settings
│   │   └── services/        # api.js (Axios base with authorization interceptors)
│   └── package.json
│
├── backend/
│   ├── config/              # db.js, seed.js (MongoDB initial seeding setup)
│   ├── controllers/         # authController, cameraController, historyController, reportController
│   ├── middleware/          # authMiddleware (JWT Verification gate)
│   ├── models/              # User, Camera, Alert, Analytics, Detection
│   ├── routes/              # authRoutes, cameras, alerts, reports, analytics, detections, ai
│   ├── server.js            # Express app wrapping Http & Socket.io servers
│   └── package.json
│
├── ai-service/
│   ├── detect.py            # Standalone OpenCV webcam tracking & HTTP post daemon
│   ├── tracker.py           # SurveillanceTracker wrapper setting ByteTrack confs
│   ├── utils.py             # Point-in-polygon math & speed estimate formulas
│   └── requirements.txt
```

---

## 🚀 Setup & Installation

### Prerequisite Systems
- Node.js (v18+)
- Python (3.9+)
- MongoDB (running local instance or Atlas URI)

### 1. Database & Backend Configuration
1. Open `SentinelAI/backend/` and create a `.env` file:
   ```env
   MONGO_URI=mongodb://localhost:27017/sentinelai
   PORT=5000
   JWT_SECRET=sentinelai_secret_hud
   ```
2. Install package dependencies and boot the developer server:
   ```bash
   cd backend
   npm install
   npm run dev
   ```
   *Note: On successful connection, the server will automatically seed dummy data if the database is unpopulated.*

### 2. React UI Dashboard Startup
1. Open `SentinelAI/frontend/`:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
2. Open `http://localhost:5173/` in your browser. Register a new commander profile (at least 6 characters passcode) to establish a login token.

### 3. AI Tracking Service Setup
1. Open `SentinelAI/ai-service/` and install Python libraries:
   ```bash
   cd ai-service
   pip install -r requirements.txt
   ```
2. Start the tracking loops:
   ```bash
   python detect.py
   ```

---

## 🌟 Core Features

- **Live CCTV Feeds Grid**: Integrates web camera feeds, falling back to raw browser webcams or nightvision matrix grids if servers disconnect.
- **ByteTrack Multi-Object Tracking**: Automatically assigns persistent IDs, draws trajectory dots, and estimates target speeds (km/h) and direction.
- **Restricted Zone (Polygon Drawing)**: Interactive polygon coordinates trigger visual alarms (screen shakes, red blinking borders) on intrusion.
- **Timeline & Notification Panels**: Dynamic scrolling feeds showing real-time radar logs and collapsible alerts filter boards.
- **CSV & PDF Telemetry Reports**: Exports spreadsheets and executive print reports.

---

## 🔮 Future Scope Roadmap
- **Drone Intercept Integration**: Auto-dispatch drone coordinate directions during boundary wire breaches.
- **Thermal Infrared camera overlays**: Color filtration adjustments for low-light night conditions.
- **Multi-Camera HUD Grid**: Stream up to 9 CCTV channels in grid matrix screens.
- **SMS/Email Alarms**: Direct SMTP warning notices to border patrol commanders.

---

## 📄 License
This project is licensed under the MIT License.

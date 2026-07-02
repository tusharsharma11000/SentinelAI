import { createContext, useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import api from "../services/api";

export const DashboardContext = createContext();

export function DashboardProvider({ children }) {
  const [stats, setStats] = useState(null);
  const [cameras, setCameras] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bellCount, setBellCount] = useState(0);
  const [toasts, setToasts] = useState([]);
  
  // Real-time activity timeline log (Day 5 Timeline)
  const [activityLog, setActivityLog] = useState([
    { id: 2, time: "05:13 PM", event: "AI Drone intercept sweeps armed.", type: "system" },
    { id: 1, time: "05:12 PM", event: "Sector Alpha-12 radar vectors initialized.", type: "system" }
  ]);

  const knownAlertIds = useRef(new Set());
  const isFirstLoad = useRef(true);

  const fetchDashboardData = async () => {
    try {
      setError(null);
      const [statsRes, camsRes, alertsRes, analyticsRes] = await Promise.all([
        api.get("/dashboard"),
        api.get("/camera/all"),
        api.get("/alerts"),
        api.get("/analytics")
      ]);

      setStats(statsRes.data);
      setCameras(camsRes.data);
      setAnalytics(analyticsRes.data);

      const latestAlerts = alertsRes.data;
      setAlerts(latestAlerts);

      // Cache known alert IDs on first mount
      if (isFirstLoad.current && latestAlerts.length > 0) {
        latestAlerts.forEach(alert => knownAlertIds.current.add(alert._id));
      }

      isFirstLoad.current = false;
      setLoading(false);
    } catch (err) {
      console.error("Dashboard fetching failure:", err);
      setError("Surveillance Core Offline. Connection with api-gateway lost.");
      setLoading(false);
    }
  };

  const triggerToast = (alert) => {
    const id = Date.now() + Math.random();
    const newToast = {
      id,
      message: `Intrusion Alert: ${alert.object} detected at ${alert.cameraId?.name || "Sector"}`,
      threatLevel: alert.threatLevel,
      object: alert.object
    };
    
    setToasts(prev => [...prev, newToast]);
    
    // Auto remove toast after 5 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 5000);
  };

  const clearToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const resetBell = () => {
    setBellCount(0);
  };

  // Socket.io Real-time Event Subscriptions
  useEffect(() => {
    fetchDashboardData();

    // Connect to Node.js backend WebSocket gateway
    const socket = io("http://localhost:5000");

    socket.on("connect", () => {
      console.log("🔌 Connected to SentinelAI WebSocket gateway.");
    });

    // Handle new object tracks (Detections)
    socket.on("new-detection", (data) => {
      const timeStamp = new Date(data.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      
      const newLog = {
        id: Date.now() + Math.random(),
        time: timeStamp,
        event: `${data.className.toUpperCase()} detected at ${data.camera} (ID: ${data.trackingId})`,
        type: data.restrictedZoneBreach ? "breach" : "detection"
      };

      // Append to top of scrolling timeline log
      setActivityLog(prev => [newLog, ...prev].slice(0, 50));
    });

    // Handle high-threat alarms (Alerts)
    socket.on("new-alert", (alert) => {
      if (!knownAlertIds.current.has(alert._id)) {
        knownAlertIds.current.add(alert._id);
        
        // Trigger Toast & Bell count increment
        triggerToast(alert);
        setBellCount(prev => prev + 1);

        // Shake visual UI briefly for High-risk breaches
        if (alert.threatLevel === "High") {
          document.body.classList.add("danger-shake-active");
          setTimeout(() => document.body.classList.remove("danger-shake-active"), 500);
        }

        // Add warning record to timeline
        const timeStamp = new Date(alert.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        const newLog = {
          id: Date.now() + Math.random(),
          time: timeStamp,
          event: `CRITICAL SEC_BREACH: ${alert.object} crossing boundary vectors!`,
          type: "breach"
        };
        setActivityLog(prev => [newLog, ...prev].slice(0, 50));

        // Auto reload dashboard data to sync table and metrics instantly
        fetchDashboardData();
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <DashboardContext.Provider 
      value={{ 
        stats, 
        cameras, 
        alerts, 
        analytics, 
        loading, 
        error, 
        bellCount, 
        toasts, 
        activityLog,
        clearToast, 
        resetBell, 
        refetch: fetchDashboardData 
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

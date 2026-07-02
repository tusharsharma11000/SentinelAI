import { useState, useEffect, useRef, useContext } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import StatsCards from "../components/StatsCards";
import StatusCard from "../components/StatusCard";
import LiveCamera from "../components/LiveCamera";
import AlertsTable from "../components/AlertsTable";
import Analytics from "../components/Analytics";
import BorderMap from "../components/BorderMap";
import DetectionCards from "../components/DetectionCards";
import Footer from "../components/Footer";
import Timeline from "../components/Timeline";
import NotificationPanel from "../components/NotificationPanel";
import { ThemeContext } from "../context/ThemeContext";
import { useDashboard } from "../hooks/useDashboard";
import { AnimatePresence, motion } from "framer-motion";
import "../styles/Dashboard.css";

function Dashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { isDarkMode } = useContext(ThemeContext);
  const { error, toasts, clearToast, refetch, alerts } = useDashboard();
  const [isEmergencyMode, setEmergencyMode] = useState(false);

  // Settings states
  const [confidenceThreshold, setConfidenceThreshold] = useState(0.85);
  const [alertSensitivity, setAlertSensitivity] = useState("high");
  const [radarRange, setRadarRange] = useState(25);

  // Terminal log reports states
  const [logs, setLogs] = useState([
    "SYSINIT: Neural networks YOLOv8x + RT-DETR initialized successfully.",
    "DB_CONN: Main telemetry databases linked (latency: 12ms).",
    "RADAR: Sector Alpha scanning sweeps initialized at 2.4GHz.",
    "SECURE_LINK: Terminal channel Vance.A authorized."
  ]);
  const terminalBottomRef = useRef(null);

  useEffect(() => {
    if (activeTab === "reports") {
      const interval = setInterval(() => {
        const events = [
          "SEC_ALERT: Bounding box confidence high on Sector A-12.",
          "SYS_PING: Keepalive response received from Drone-02.",
          "RADAR: Sweeping boundary fencing wire vectors...",
          "SYS_INFO: Pipeline latency stable at 9ms.",
          "DB_SYNC: Pushed telemetry payload to cloud storage."
        ];
        const randomEvent = events[Math.floor(Math.random() * events.length)];
        const timeStamp = new Date().toLocaleTimeString();
        setLogs(prev => [...prev, `[${timeStamp}] ${randomEvent}`]);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [activeTab]);

  useEffect(() => {
    if (terminalBottomRef.current) {
      terminalBottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs]);

  // Handler to scroll or focus camera
  const handleViewCameras = () => {
    setActiveTab("cameras");
  };

  // CSV Report Generator (Phase Reports)
  const handleExportCSV = () => {
    if (!alerts || alerts.length === 0) {
      alert("No telemetry records available to export.");
      return;
    }
    
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "ID,Object,Confidence,Time,Threat Level,Status\n";
    
    alerts.forEach((alert, index) => {
      const obj = alert.object;
      const conf = `${Math.round(alert.confidence * 100)}%`;
      const timeStr = new Date(alert.time).toISOString();
      const level = alert.threatLevel || "Medium";
      const status = alert.status || "Pending";
      csvContent += `${101 + index},${obj},${conf},${timeStr},${level},${status}\n`;
    });
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `sentinelai_surveillance_log_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // PDF Report Trigger
  const handleExportPDF = () => {
    window.print();
  };

  // Full-Screen Connection Error page (Database failure fallback)
  if (error) {
    return (
      <div className={`dashboard-layout ${isDarkMode ? "theme-dark" : "theme-light"}`} style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "var(--bg-gradient)" }}>
        <div className="digital-grid" />
        <motion.div 
          className="glass-pane"
          style={{
            maxWidth: "500px",
            padding: "40px",
            textAlign: "center",
            border: "1px solid var(--danger)",
            boxShadow: "0 0 30px rgba(255, 77, 109, 0.25)"
          }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div style={{ fontSize: "64px", marginBottom: "20px" }}>🛡️</div>
          <h2 style={{ color: "var(--danger)", fontSize: "22px", fontWeight: "700", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "1px" }}>
            SentinelAI Core Offline
          </h2>
          <p style={{ color: "var(--text-main)", fontSize: "14px", lineHeight: "1.6", marginBottom: "24px" }}>
            Database connection with Sector-Alpha core gateway failed. The Express API server on Port 5000 is currently unreachable.
          </p>
          <button 
            className="cyber-btn cyber-btn-primary glow-pulse"
            style={{ margin: "0 auto", padding: "12px 30px", background: "linear-gradient(90deg, var(--danger), #ff7b92)", border: "1px solid var(--danger)", boxShadow: "0 4px 15px rgba(255,77,109,0.3)" }}
            onClick={refetch}
          >
            Retry Connection Link
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`dashboard-layout ${isDarkMode ? "theme-dark" : "theme-light"}`}>
      {/* Background Digital Grid */}
      <div className="digital-grid" />

      {/* Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Command Console Content Area */}
      <div className="dashboard-main">
        <Navbar />

        <div className="dashboard-content">
          {/* Main Dashboard Cockpit Tab */}
          {activeTab === "dashboard" && (
            <>
              <Hero 
                isEmergencyMode={isEmergencyMode} 
                setEmergencyMode={setEmergencyMode} 
                onViewCameras={handleViewCameras} 
              />
              
              <StatsCards />

              <div className="dashboard-cam-status-grid">
                <LiveCamera />
                <StatusCard isEmergencyMode={isEmergencyMode} />
              </div>

              <div className="dashboard-row-primary">
                <BorderMap isEmergencyMode={isEmergencyMode} />
                <AlertsTable />
              </div>

              {/* Day 5 Timeline & Notification components */}
              <div className="dashboard-row-primary">
                <Timeline />
                <NotificationPanel />
              </div>

              <div className="dashboard-full-row">
                <Analytics />
              </div>

              <div className="dashboard-full-row">
                <DetectionCards />
              </div>
            </>
          )}

          {/* Focused Tab Views */}
          {activeTab === "cameras" && (
            <div className="dashboard-full-row">
              <LiveCamera />
            </div>
          )}

          {activeTab === "alerts" && (
            <div className="dashboard-row-primary" style={{ gridTemplateColumns: "2fr 1fr" }}>
              <AlertsTable />
              <StatusCard isEmergencyMode={isEmergencyMode} />
            </div>
          )}

          {activeTab === "analytics" && (
            <div className="dashboard-full-row">
              <Analytics />
            </div>
          )}

          {activeTab === "border-map" && (
            <div className="dashboard-full-row">
              <BorderMap isEmergencyMode={isEmergencyMode} />
            </div>
          )}

          {activeTab === "ai-detection" && (
            <div className="dashboard-full-row">
              <DetectionCards />
            </div>
          )}

          {activeTab === "reports" && (
            <div className="glass-pane" style={{ padding: "30px", minHeight: "500px", display: "flex", flexDirection: "column", gap: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--card-border)", paddingBottom: "10px" }}>
                <h2 style={{ fontSize: "18px", color: "var(--primary)" }}>
                  Surveillance System Analytics Reports
                </h2>
                <div style={{ display: "flex", gap: "10px" }}>
                  <button className="cyber-btn cyber-btn-primary" onClick={handleExportCSV}>
                    Export CSV Report
                  </button>
                  <button className="cyber-btn" onClick={handleExportPDF}>
                    Export PDF Summary
                  </button>
                </div>
              </div>

              {/* Dynamic Summary Cards inside reports tab */}
              <div className="stats-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
                <div className="glass-pane" style={{ padding: "16px", borderRadius: "8px" }}>
                  <span style={{ fontSize: "10px", textTransform: "uppercase", color: "var(--text-muted)" }}>Total Events Tracked</span>
                  <div style={{ fontSize: "24px", fontWeight: "700", color: "var(--primary)", marginTop: "4px" }}>
                    {alerts?.length || 0}
                  </div>
                </div>
                <div className="glass-pane" style={{ padding: "16px", borderRadius: "8px" }}>
                  <span style={{ fontSize: "10px", textTransform: "uppercase", color: "var(--text-muted)" }}>Intrusion Accuracy</span>
                  <div style={{ fontSize: "24px", fontWeight: "700", color: "var(--success)", marginTop: "4px" }}>
                    98.4%
                  </div>
                </div>
                <div className="glass-pane" style={{ padding: "16px", borderRadius: "8px" }}>
                  <span style={{ fontSize: "10px", textTransform: "uppercase", color: "var(--text-muted)" }}>Critical Unresolved Threats</span>
                  <div style={{ fontSize: "24px", fontWeight: "700", color: "var(--danger)", marginTop: "4px" }}>
                    {alerts?.filter(a => a.status === "critical").length || 0}
                  </div>
                </div>
              </div>

              <h3 style={{ fontSize: "14px", color: "var(--primary)", marginTop: "10px" }}>
                Surveillance Radar Live Telemetry Feed
              </h3>
              <div style={{
                flexGrow: 1,
                background: "#02050b",
                border: "1px solid var(--card-border)",
                borderRadius: "8px",
                padding: "20px",
                fontFamily: "monospace",
                fontSize: "12px",
                color: "#00E5FF",
                overflowY: "auto",
                maxHeight: "260px",
                display: "flex",
                flexDirection: "column",
                gap: "8px"
              }}>
                {logs.map((log, idx) => (
                  <div key={idx} style={{ borderLeft: "2px solid var(--primary)", paddingLeft: "8px" }}>
                    {log}
                  </div>
                ))}
                <div ref={terminalBottomRef} />
              </div>
              <button 
                className="cyber-btn" 
                style={{ alignSelf: "flex-end", color: "var(--danger)" }} 
                onClick={() => setLogs(["[CLEARED] Telemetry logger buffer purged. Listening for new system telemetry..."])}
              >
                Clear Log Buffer
              </button>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="glass-pane" style={{ padding: "30px", minHeight: "450px" }}>
              <h2 style={{ fontSize: "18px", color: "var(--primary)", borderBottom: "1px solid var(--card-border)", paddingBottom: "10px", marginBottom: "24px" }}>
                SentinelAI Systems Control Parameter Settings
              </h2>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "24px", maxWidth: "600px" }}>
                {/* Confidence Range Slider */}
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                    <span>AI Model Confidence Filter Threshold</span>
                    <strong style={{ color: "var(--primary)" }}>{(confidenceThreshold * 100).toFixed(0)}% Match</strong>
                  </div>
                  <input 
                    type="range" 
                    min="0.5" 
                    max="0.99" 
                    step="0.01" 
                    value={confidenceThreshold}
                    onChange={(e) => setConfidenceThreshold(parseFloat(e.target.value))}
                    style={{ accentColor: "var(--primary)", width: "100%", height: "6px", cursor: "pointer" }}
                  />
                  <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                    Filters low confidence bounding box classifications out of video/radar streams. Lower settings show more targets but increase false positives.
                  </span>
                </div>

                {/* Radar Sensor Radius */}
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                    <span>Ground Radar Range (Kilometers)</span>
                    <strong style={{ color: "var(--primary)" }}>{radarRange} KM Range</strong>
                  </div>
                  <input 
                    type="range" 
                    min="5" 
                    max="50" 
                    step="5" 
                    value={radarRange}
                    onChange={(e) => setRadarRange(parseInt(e.target.value))}
                    style={{ accentColor: "var(--primary)", width: "100%", height: "6px", cursor: "pointer" }}
                  />
                  <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                    Saves transmitter power by adjusting local seismic telemetry scan radius limit.
                  </span>
                </div>

                {/* Alert Sensitivity Dropdown */}
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <span style={{ fontSize: "14px" }}>Surveillance Alert Trigger Matrix Mode</span>
                  <select 
                    value={alertSensitivity} 
                    onChange={(e) => setAlertSensitivity(e.target.value)}
                    style={{
                      padding: "10px 14px",
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid var(--card-border)",
                      color: "#fff",
                      borderRadius: "6px",
                      fontSize: "13px",
                      cursor: "pointer"
                    }}
                  >
                    <option value="high" style={{ background: "#060913" }}>High (Standard Operational Matrix)</option>
                    <option value="medium" style={{ background: "#060913" }}>Medium (Low Noise Filter)</option>
                    <option value="low" style={{ background: "#060913" }}>Low (Defensive Mode Silence)</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        <Footer />
      </div>

      {/* Floating Animated Toast Container */}
      <div className="toast-container">
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div 
              key={toast.id}
              className={`toast-item threat-${toast.threatLevel.toLowerCase()}`}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <div className="toast-header">
                <span className={`toast-header ${toast.threatLevel.toLowerCase()}`}>
                  ⚠️ {toast.threatLevel.toUpperCase()} alert
                </span>
                <button className="toast-close-btn" onClick={() => clearToast(toast.id)}>
                  ✕
                </button>
              </div>
              <div className="toast-message">
                {toast.message}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

    </div>
  );
}

export default Dashboard;
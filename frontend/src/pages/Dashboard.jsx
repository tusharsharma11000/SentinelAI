import { useState, useEffect, useRef } from "react";
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
import "../styles/Dashboard.css";

function Dashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isDarkMode, setIsDarkMode] = useState(true);
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

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Handler to scroll or focus camera
  const handleViewCameras = () => {
    setActiveTab("cameras");
  };

  return (
    <div className={`dashboard-layout ${isDarkMode ? "theme-dark" : "theme-light"}`}>
      {/* Futuristic Background Digital Grid */}
      <div className="digital-grid" />

      {/* Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Command Console Content Area */}
      <div className="dashboard-main">
        <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

        <div className="dashboard-content">
          {/* Main Dashboard Cockpit Tab */}
          {activeTab === "dashboard" && (
            <>
              <Hero 
                isEmergencyMode={isEmergencyMode} 
                setEmergencyMode={setEmergencyMode} 
                onViewCameras={handleViewCameras} 
              />
              
              <StatsCards 
                activeCams={24} 
                alertsCount={isEmergencyMode ? 14 : 8} 
                intrusionsCount={isEmergencyMode ? 3 : 2} 
                accuracy={98.4} 
              />

              <div className="dashboard-cam-status-grid">
                <LiveCamera />
                <StatusCard isEmergencyMode={isEmergencyMode} />
              </div>

              <div className="dashboard-row-primary">
                <BorderMap isEmergencyMode={isEmergencyMode} />
                <AlertsTable />
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
              <h2 style={{ fontSize: "18px", color: "var(--primary)", borderBottom: "1px solid var(--card-border)", paddingBottom: "10px" }}>
                SURVEILLANCE RADAR LIVE REPORT LOGGER
              </h2>
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
                maxHeight: "380px",
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
                className="cyber-btn cyber-btn-primary" 
                style={{ alignSelf: "flex-end" }} 
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
    </div>
  );
}

export default Dashboard;
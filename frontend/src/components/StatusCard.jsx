import { motion } from "framer-motion";
import { FiActivity } from "react-icons/fi";
import { useDashboard } from "../hooks/useDashboard";
import "./StatusCard.css";

function StatusCard({ isEmergencyMode }) {
  const { stats, loading } = useDashboard();

  if (loading) {
    return (
      <div className="skeleton-card" style={{ minHeight: "380px" }}>
        <div className="skeleton skeleton-title" style={{ width: "50%" }} />
        <div style={{ display: "flex", justifyContent: "center", margin: "40px 0" }}>
          <div className="skeleton skeleton-circle" style={{ width: "100px", height: "100px" }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <div className="skeleton skeleton-text" />
          <div className="skeleton skeleton-text" style={{ width: "80%" }} />
        </div>
      </div>
    );
  }

  const borderStatus = isEmergencyMode ? "BREACH DETECTED" : (stats?.borderStatus || "ALL CLEAR");
  const isAlertActive = isEmergencyMode || borderStatus === "BREACH DETECTED" || stats?.activeAlerts > 2;
  
  const systemHealth = stats?.systemHealth || 98;
  const aiConfidence = 99.2;
  const threatLevel = isAlertActive ? "CRITICAL" : "LOW";

  return (
    <motion.div 
      className="glass-pane status-card"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="status-card-header">
        <span className="status-card-title">
          <FiActivity className="glow-pulse" style={{ color: isAlertActive ? "var(--danger)" : "var(--success)" }} /> 
          AI Defenses Status
        </span>
      </div>

      <div className="status-shield-container">
        <div className="shield-wrapper">
          {/* Radial Pulse Rings */}
          <div className={`shield-pulse-ring ${isAlertActive ? "danger" : ""}`}></div>
          <div 
            className={`shield-pulse-ring ${isAlertActive ? "danger" : ""}`} 
            style={{ animationDelay: "0.5s" }}
          ></div>
          <div 
            className={`shield-pulse-ring ${isAlertActive ? "danger" : ""}`} 
            style={{ animationDelay: "1s" }}
          ></div>

          {/* Shield Icon SVG */}
          <svg 
            className={`shield-svg ${isAlertActive ? "danger" : ""}`} 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        </div>

        <div className="status-text-display">
          <span className="status-label">System Health Matrix</span>
          <div className={`status-badge ${isAlertActive ? "danger" : ""}`}>
            {borderStatus}
          </div>
        </div>
      </div>

      {/* Detail Metrics */}
      <div className="status-metrics">
        {/* System Health */}
        <div className="metric-row">
          <div className="metric-header">
            <span className="metric-name">Integrity Matrix</span>
            <span className="metric-val">{systemHealth}%</span>
          </div>
          <div className="metric-progress-bg">
            <motion.div 
              className="metric-progress-fill" 
              style={{ 
                background: isAlertActive ? "var(--danger)" : "var(--primary)",
                width: 0 
              }}
              animate={{ width: `${systemHealth}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* AI Confidence */}
        <div className="metric-row">
          <div className="metric-header">
            <span className="metric-name">Neural Confidence</span>
            <span className="metric-val">{aiConfidence}%</span>
          </div>
          <div className="metric-progress-bg">
            <motion.div 
              className="metric-progress-fill" 
              style={{ 
                background: "var(--accent)",
                width: 0 
              }}
              animate={{ width: `${aiConfidence}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Threat Level */}
        <div className="metric-row">
          <div className="metric-header">
            <span className="metric-name">Current Threat Index</span>
            <span 
              className="metric-val" 
              style={{ 
                color: isAlertActive ? "var(--danger)" : "var(--success)",
                fontWeight: "700" 
              }}
            >
              {threatLevel}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default StatusCard;

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAlerts } from "../hooks/useAlerts";
import "./AlertsTable.css";

// Loading Skeleton for Alerts Table
function TableSkeleton() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="skeleton" style={{ height: "40px", width: "100%", borderRadius: "6px" }} />
      ))}
    </div>
  );
}

function AlertsTable() {
  const { alerts, loading, error, updateAlertStatus } = useAlerts();
  const [filter, setFilter] = useState("all");

  const handleResolve = async (id) => {
    try {
      await updateAlertStatus(id, "resolved");
    } catch (err) {
      console.error("Failed to resolve alert:", err);
    }
  };

  if (loading && alerts.length === 0) {
    return (
      <div className="glass-pane alerts-card">
        <h2 className="alerts-title" style={{ marginBottom: "15px" }}>Surveillance Incident Database</h2>
        <TableSkeleton />
      </div>
    );
  }

  // Format dynamic alerts to fit Phase 6 layout structures
  const formattedAlerts = alerts.map((alert, index) => {
    const objClass = alert.object || "Target";
    const capitalizedObj = objClass.charAt(0).toUpperCase() + objClass.slice(1);
    
    // Map threat level
    let status = alert.threatLevel || "Low";
    
    // Format timestamp
    let formattedTime = "12:00 PM";
    try {
      const date = new Date(alert.time);
      formattedTime = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch (e) {
      console.error(e);
    }

    return {
      _id: alert._id,
      id: 101 + index,
      object: capitalizedObj,
      confidence: `${Math.round(alert.confidence * 100)}%`,
      time: formattedTime,
      status: status,
      rawStatus: alert.status // "critical", "pending", "resolved"
    };
  });

  const filteredAlerts = filter === "all"
    ? formattedAlerts
    : formattedAlerts.filter(a => a.status.toLowerCase() === filter.toLowerCase());

  return (
    <motion.div 
      className="glass-pane alerts-card"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      <div className="alerts-header">
        <h2 className="alerts-title">AI Real-Time Detections</h2>
        <div className="alerts-filters">
          <button 
            className={`filter-btn ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            ALL
          </button>
          <button 
            className={`filter-btn ${filter === "high" ? "active" : ""}`}
            onClick={() => setFilter("high")}
          >
            HIGH
          </button>
          <button 
            className={`filter-btn ${filter === "medium" ? "active" : ""}`}
            onClick={() => setFilter("medium")}
          >
            MEDIUM
          </button>
          <button 
            className={`filter-btn ${filter === "low" ? "active" : ""}`}
            onClick={() => setFilter("low")}
          >
            LOW
          </button>
        </div>
      </div>

      {error && (
        <div style={{ color: "var(--danger)", fontSize: "11px", marginBottom: "10px", fontFamily: "monospace" }}>
          ⚠️ connection lost: display offline logs
        </div>
      )}

      <div className="table-container">
        <table className="cyber-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Object</th>
              <th>Confidence</th>
              <th>Time</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence mode="popLayout">
              {filteredAlerts.map((item) => (
                <motion.tr 
                  key={item._id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.3 }}
                >
                  <td style={{ fontFamily: "monospace", fontWeight: "700" }}>{item.id}</td>
                  <td>
                    <span style={{ fontWeight: "600" }}>{item.object}</span>
                  </td>
                  <td style={{ fontFamily: "monospace", fontWeight: "600" }}>{item.confidence}</td>
                  <td style={{ color: "var(--text-muted)", fontFamily: "monospace" }}>{item.time}</td>
                  <td>
                    <span className={`threat-badge threat-${item.status.toLowerCase()}`}>
                      {item.status}
                    </span>
                  </td>
                  <td>
                    {item.rawStatus !== "resolved" ? (
                      <button 
                        onClick={() => handleResolve(item._id)}
                        style={{
                          background: "rgba(0, 210, 106, 0.15)",
                          border: "1px solid var(--success)",
                          color: "var(--success)",
                          fontSize: "10px",
                          fontWeight: "600",
                          padding: "3px 8px",
                          borderRadius: "4px",
                          cursor: "pointer",
                          transition: "0.2s"
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = "var(--success)";
                          e.target.style.color = "#000";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = "rgba(0, 210, 106, 0.15)";
                          e.target.style.color = "var(--success)";
                        }}
                      >
                        Resolve
                      </button>
                    ) : (
                      <span style={{ fontSize: "10px", color: "var(--text-muted)", fontWeight: "500" }}>
                        Logged
                      </span>
                    )}
                  </td>
                </motion.tr>
              ))}
              {filteredAlerts.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "12px" }}>
                    No incident reports logged. Sector is clear.
                  </td>
                </tr>
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

export default AlertsTable;

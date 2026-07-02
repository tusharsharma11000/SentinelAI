import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./AlertsTable.css";

// Initial mock data following the new Phase 6 specifications
const mockDetections = [
  { id: 104, object: "Person", confidence: "98%", time: "10:30 AM", status: "High" },
  { id: 103, object: "Drone", confidence: "95%", time: "10:28 AM", status: "High" },
  { id: 102, object: "Car", confidence: "92%", time: "10:25 AM", status: "Medium" },
  { id: 101, object: "Cat", confidence: "87%", time: "10:20 AM", status: "Low" }
];

function AlertsTable() {
  const [filter, setFilter] = useState("all");
  const [detections, setDetections] = useState(mockDetections);

  // Polling backend API (Node server on port 5000)
  useEffect(() => {
    const fetchDetections = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/detections");
        if (response.ok) {
          const data = await response.json();
          
          if (data && data.length > 0) {
            // Map Flask detections to Phase 6 UI columns structure
            const mapped = data.map((item, index) => {
              const objClass = item.class || "Unknown";
              const capitalizedObj = objClass.charAt(0).toUpperCase() + objClass.slice(1);
              
              // Map class to Threat status (High, Medium, Low)
              let status = "Low";
              const clsLower = objClass.toLowerCase();
              if (["person", "drone", "unknown object"].includes(clsLower)) {
                status = "High";
              } else if (["car", "bus", "truck", "motorcycle", "bicycle"].includes(clsLower)) {
                status = "Medium";
              }

              // Format date timestamp to e.g. "10:30 AM"
              let formattedTime = "10:30 AM";
              try {
                const date = new Date(item.time);
                formattedTime = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
              } catch (e) {
                console.error("Time parsing error:", e);
              }

              return {
                id: 101 + index,
                object: capitalizedObj,
                confidence: `${Math.round(item.confidence * 100)}%`,
                time: formattedTime,
                status: status
              };
            });
            // Reverse so latest detections show first
            setDetections(mapped.reverse());
          }
        }
      } catch (err) {
        console.warn("Express backend offline. Running in local simulation mode.");
      }
    };

    fetchDetections();
    const interval = setInterval(fetchDetections, 2000); // Poll every 2 seconds
    return () => clearInterval(interval);
  }, []);

  const filteredDetections = filter === "all" 
    ? detections 
    : detections.filter(d => d.status.toLowerCase() === filter.toLowerCase());

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

      <div className="table-container">
        <table className="cyber-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Object</th>
              <th>Confidence</th>
              <th>Time</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence mode="popLayout">
              {filteredDetections.map((item) => (
                <motion.tr 
                  key={item.id}
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
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

export default AlertsTable;

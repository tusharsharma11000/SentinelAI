import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDashboard } from "../hooks/useDashboard";
import "./NotificationPanel.css";

const initialNotifs = [
  { id: 1, type: "camera", category: "camera offline", text: "CCTV Sector Echo-10 went offline. Ping timeout.", time: "10:15 AM", unread: true },
  { id: 2, type: "success", category: "detection success", text: "YOLOv8 surveillance network weights loaded at sector Alpha.", time: "09:30 AM", unread: false },
];

function NotificationPanel() {
  const { alerts } = useDashboard();
  const [notifications, setNotifications] = useState(initialNotifs);
  const [filter, setFilter] = useState("all");

  // Sync with alerts list to generate real-time breach notifications
  useEffect(() => {
    if (alerts && alerts.length > 0) {
      const alertNotifs = alerts.map(alert => {
        const isHigh = alert.threatLevel === "High";
        const cat = isHigh ? "high alert" : "ai event";
        let text = `Intruder Alert: ${alert.object} identified at ${alert.cameraId?.name || "sector boundary"}.`;
        
        return {
          id: alert._id,
          type: isHigh ? "high" : "event",
          category: cat,
          text,
          time: new Date(alert.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          unread: alert.status === "critical"
        };
      });

      // Merge with initial system notifications
      setNotifications(prev => {
        const systemNotifs = prev.filter(n => typeof n.id === "number");
        return [...alertNotifs, ...systemNotifs];
      });
    }
  }, [alerts]);

  const handleMarkAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
  };

  const handleDelete = (e, id) => {
    e.stopPropagation(); // Prevent trigger mark as read
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const filteredNotifs = notifications.filter(n => {
    if (filter === "unread") return n.unread;
    if (filter === "all") return true;
    return n.type === filter; // e.g. "high", "camera", "success"
  });

  return (
    <div className="glass-pane notif-card">
      <div className="notif-header">
        <h2 className="notif-title">Alert & Notification Center</h2>
        <div className="notif-filters">
          <button 
            className={`notif-filter-btn ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            ALL
          </button>
          <button 
            className={`notif-filter-btn ${filter === "unread" ? "active" : ""}`}
            onClick={() => setFilter("unread")}
          >
            UNREAD
          </button>
        </div>
      </div>

      <div className="notif-list">
        <AnimatePresence mode="popLayout">
          {filteredNotifs.map((notif) => (
            <motion.div 
              key={notif.id}
              className={`notif-item ${notif.unread ? "unread" : ""} ${notif.type === "high" ? "high" : ""}`}
              onClick={() => handleMarkAsRead(notif.id)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: 20 }}
              layout
            >
              <span className={`notif-badge ${notif.type}`}>
                {notif.category}
              </span>
              <p className="notif-text">{notif.text}</p>
              
              <div className="notif-meta">
                <span>{notif.time}</span>
                <button 
                  className="notif-action-btn"
                  onClick={(e) => handleDelete(e, notif.id)}
                >
                  Clear
                </button>
              </div>
            </motion.div>
          ))}
          {filteredNotifs.length === 0 && (
            <div style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "11px", padding: "20px" }}>
              No notification entries found.
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default NotificationPanel;

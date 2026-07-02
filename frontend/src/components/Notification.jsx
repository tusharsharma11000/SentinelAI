import { motion } from "framer-motion";
import { FiX, FiAlertTriangle } from "react-icons/fi";

function Notification({ notification, onClose }) {
  const isHigh = notification.threatLevel === "High" || notification.threatLevel === "critical";

  return (
    <motion.div 
      className={`toast-item ${isHigh ? "threat-high" : "threat-medium"}`}
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      style={{
        padding: "16px",
        borderRadius: "8px",
        minWidth: "260px",
        display: "flex",
        flexDirection: "column",
        gap: "6px"
      }}
    >
      <div className="toast-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span 
          style={{ 
            color: isHigh ? "var(--danger)" : "var(--warning)", 
            fontWeight: "700", 
            fontSize: "11px",
            textTransform: "uppercase" 
          }}
        >
          <FiAlertTriangle style={{ marginRight: "6px" }} />
          {isHigh ? "🚨 HIGH ALERT" : "⚠️ AI EVENT"}
        </span>
        <button 
          onClick={onClose} 
          style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "12px" }}
        >
          <FiX />
        </button>
      </div>
      
      <div className="toast-message" style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
        <strong style={{ fontSize: "13px", color: "#fff" }}>
          {notification.object || "Target"} Detected
        </strong>
        <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
          Camera: {notification.camera || "Camera 01"}
        </span>
        <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
          Confidence: {notification.confidence || "98%"}
        </span>
      </div>
    </motion.div>
  );
}

export default Notification;

import { motion } from "framer-motion";
import "./AlertCard.css";

function AlertCard({ alert, onResolve }) {
  const isHigh = alert.threatLevel === "High";
  
  return (
    <motion.div 
      className={`alert-item-card threat-${alert.threatLevel.toLowerCase()}`}
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="alert-card-info">
        <div className="alert-card-header-row">
          <span className={`alert-card-badge ${alert.threatLevel.toLowerCase()}`}>
            {alert.threatLevel} Threat
          </span>
          <span className="alert-card-object">{alert.object} detected</span>
        </div>
        <span className="alert-card-meta">
          Sector: {alert.cameraId?.name || "Border Boundary"} | Conf: {Math.round(alert.confidence * 100)}% | <span className="alert-card-time">{new Date(alert.time).toLocaleTimeString()}</span>
        </span>
      </div>

      {alert.status !== "resolved" && (
        <button 
          className="alert-card-btn" 
          onClick={() => onResolve(alert._id)}
        >
          Resolve
        </button>
      )}
    </motion.div>
  );
}

export default AlertCard;

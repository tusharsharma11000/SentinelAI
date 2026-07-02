import { motion, AnimatePresence } from "framer-motion";
import { useDashboard } from "../hooks/useDashboard";
import "./Timeline.css";

function Timeline() {
  const { activityLog } = useDashboard();

  return (
    <div className="glass-pane timeline-card">
      <h2 className="timeline-title">Surveillance Activity Timeline</h2>
      
      <div className="timeline-list">
        <AnimatePresence mode="popLayout">
          {activityLog.map((log) => (
            <motion.div 
              key={log.id}
              className="timeline-item"
              initial={{ opacity: 0, x: -10, y: 5 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.3 }}
            >
              {/* Colored tracker dot */}
              <span className={`timeline-dot type-${log.type}`} />
              
              <div className="timeline-content">
                <span className="timeline-time">{log.time}</span>
                <span className={`timeline-event ${log.type === "breach" ? "breach" : ""}`}>
                  {log.event}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default Timeline;

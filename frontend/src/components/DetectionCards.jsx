import { useState } from "react";
import { motion } from "framer-motion";
import { FiTarget, FiCheckCircle } from "react-icons/fi";
import "./DetectionCards.css";

const detectionItems = [
  {
    id: "det-1",
    label: "Person",
    imgUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&q=80&w=300",
    conf: 98.4,
    time: "15:04:12",
    camera: "Cam Sector A-12",
    threat: "high"
  },
  {
    id: "det-2",
    label: "Vehicle",
    imgUrl: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&q=80&w=300",
    conf: 92.1,
    time: "14:58:32",
    camera: "Cam Sector B-05",
    threat: "medium"
  },
  {
    id: "det-3",
    label: "Drone",
    imgUrl: "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&q=80&w=300",
    conf: 95.6,
    time: "14:41:09",
    camera: "Cam Sector A-12",
    threat: "high"
  },
  {
    id: "det-4",
    label: "Animal",
    imgUrl: "https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?auto=format&fit=crop&q=80&w=300",
    conf: 88.2,
    time: "13:52:18",
    camera: "Cam Sector C-08",
    threat: "low"
  },
  {
    id: "det-5",
    label: "Unknown Object",
    imgUrl: "https://images.unsplash.com/photo-1535016120720-40c646be5580?auto=format&fit=crop&q=80&w=300",
    conf: 74.5,
    time: "13:10:45",
    camera: "Cam Sector B-05",
    threat: "medium"
  }
];

function DetectionCards() {
  const [lockedTargets, setLockedTargets] = useState({});

  const toggleTargetLock = (id) => {
    setLockedTargets(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div className="detections-section">
      <div className="detections-header">
        <h2 className="detections-title">Active AI Targets Lock</h2>
      </div>

      <div className="detections-grid">
        {detectionItems.map((item, idx) => {
          const isLocked = lockedTargets[item.id];
          
          return (
            <motion.div 
              key={item.id}
              className="glass-pane detection-card"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
            >
              {/* Image stream */}
              <div className="detection-img-container">
                <img 
                  src={item.imgUrl} 
                  alt={item.label} 
                  className="detection-img" 
                  style={{ 
                    filter: isLocked 
                      ? "sepia(1) hue-rotate(-50deg) saturate(3) contrast(1.2)" // red tracking lens
                      : "none"
                  }}
                />
                
                {/* HUD Targeting Overlay */}
                <div className="detection-hud-overlay">
                  {isLocked && <div className="hud-crosshair"></div>}
                  <div className="hud-target-laser"></div>
                </div>
              </div>

              {/* Details details */}
              <div className="detection-details">
                <div className="detection-meta-row">
                  <span className="detection-label">{item.label}</span>
                  <span className={`detection-conf ${item.threat}`}>
                    {item.conf}% Match
                  </span>
                </div>

                <div className="detection-meta-row" style={{ marginTop: "4px" }}>
                  <span>{item.camera}</span>
                  <span style={{ fontFamily: "monospace" }}>{item.time}</span>
                </div>

                <button 
                  className={`track-btn ${isLocked ? "tracking-locked" : ""}`}
                  onClick={() => toggleTargetLock(item.id)}
                >
                  {isLocked ? (
                    <>
                      <FiCheckCircle /> Tracking Locked
                    </>
                  ) : (
                    <>
                      <FiTarget /> Engage Lock
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export default DetectionCards;

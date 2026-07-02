import { motion } from "framer-motion";
import { FiVideo, FiAlertOctagon } from "react-icons/fi";
import "./Hero.css";

function Hero({ isEmergencyMode, setEmergencyMode, onViewCameras }) {
  return (
    <motion.div 
      className={`hero-section ${isEmergencyMode ? "emergency-mode" : ""}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Scanline Overlay */}
      <div className="hero-scanline"></div>

      {/* SVG Futuristic Background Graphics */}
      <svg className="hero-background-svg" viewBox="0 0 400 200" fill="none">
        {/* Radar Rings */}
        <motion.circle 
          cx="280" cy="100" r="80" 
          stroke={isEmergencyMode ? "var(--danger)" : "var(--primary)"} 
          strokeWidth="1" strokeDasharray="3 3"
          animate={{ rotate: 360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        />
        <motion.circle 
          cx="280" cy="100" r="50" 
          stroke={isEmergencyMode ? "var(--danger)" : "var(--accent)"} 
          strokeWidth="1.5"
          animate={{ scale: [0.95, 1.05, 0.95] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.circle 
          cx="280" cy="100" r="20" 
          stroke={isEmergencyMode ? "var(--danger)" : "var(--primary)"} 
          strokeWidth="1"
          animate={{ opacity: [0.4, 0.9, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Radar sweep line */}
        <motion.line 
          x1="280" y1="100" x2="360" y2="100" 
          stroke={isEmergencyMode ? "var(--danger)" : "var(--primary)"} 
          strokeWidth="1.5"
          style={{ originX: "280px", originY: "100px" }}
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />

        {/* Cyber Network nodes/lines */}
        <path d="M50,150 L100,100 L200,130 L280,100" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
        <path d="M120,40 L180,80 L280,100" stroke="rgba(0, 229, 255, 0.05)" strokeWidth="1" />

        {/* Glowing node dots */}
        <circle cx="100" cy="100" r="3" fill="var(--accent)" />
        <circle cx="200" cy="130" r="3" fill="var(--primary)" />
        <circle cx="180" cy="80" r="2" fill="var(--success)" />
        
        {/* Floating particles */}
        <motion.circle 
          cx="80" cy="60" r="2" fill="var(--primary)"
          animate={{ y: [0, -15, 0], opacity: [0.2, 0.8, 0.2] }}
          transition={{ duration: 5, repeat: Infinity }}
        />
        <motion.circle 
          cx="220" cy="50" r="1.5" fill="var(--success)"
          animate={{ y: [0, -20, 0], opacity: [0.1, 0.6, 0.1] }}
          transition={{ duration: 7, repeat: Infinity, delay: 1 }}
        />
        <motion.circle 
          cx="150" cy="160" r="2" fill="var(--accent)"
          animate={{ y: [0, -10, 0], opacity: [0.3, 0.9, 0.3] }}
          transition={{ duration: 6, repeat: Infinity, delay: 2 }}
        />
      </svg>

      <div className="hero-content">
        <span className="hero-subtitle-top">System Authorization: Granted</span>
        <h2 className="hero-title">
          {isEmergencyMode ? "EMERGENCY THREAT RESPONSE ACTIVATED" : "Welcome, Commander"}
        </h2>
        <p className="hero-subtitle">
          {isEmergencyMode 
            ? "Critical alert status active. All border defensive systems, response teams, and surveillance sectors are currently on highalert." 
            : "SentinelAI is scanning sectors A-12 through F-09. Tactical overlays and neural intelligence maps are fully synced."
          }
        </p>

        <div className="hero-actions">
          <button 
            className="cyber-btn cyber-btn-primary"
            onClick={onViewCameras}
          >
            <FiVideo /> View Cameras
          </button>
          
          <button 
            className="cyber-btn cyber-btn-danger glow-pulse"
            onClick={() => setEmergencyMode(!isEmergencyMode)}
          >
            <FiAlertOctagon /> {isEmergencyMode ? "Deactivate Alert" : "Emergency Mode"}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default Hero;

import { useState } from "react";
import { motion } from "framer-motion";
import "./BorderMap.css";

const mapSensors = [
  { id: "S-101", x: 100, y: 150, name: "Cam Alpha Pin", status: "Active", temp: "24°C", color: "var(--success)" },
  { id: "S-102", x: 260, y: 90, name: "Seismic Ground Sensor", status: "Anomaly Detected", temp: "22°C", color: "var(--danger)" },
  { id: "S-103", x: 420, y: 180, name: "Gate 4 Microwave Sensor", status: "Active", temp: "28°C", color: "var(--success)" },
  { id: "S-104", x: 550, y: 120, name: "Cam Bravo Pin", status: "Active", temp: "25°C", color: "var(--primary)" },
  { id: "S-105", x: 340, y: 220, name: "Fence Vector Ground Sensor", status: "Offline", temp: "0°C", color: "var(--warning)" },
];

function BorderMap({ isEmergencyMode }) {
  const [activeSensor, setActiveSensor] = useState(null);

  // Patrol route coordinates
  const patrolRoute = "M 80,140 Q 240,60 400,150 T 600,100";
  const borderFence = "M 30,220 L 150,190 L 300,140 L 450,170 L 620,130";

  return (
    <motion.div 
      className="glass-pane map-card"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
    >
      <div className="map-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 className="map-title">Tactical Border Sensor Grid</h2>
        <span style={{ fontSize: "11px", color: "var(--text-muted)", fontFamily: "monospace" }}>
          SYS.RADAR_SYNC: 100%
        </span>
      </div>

      <div className="map-wrapper">
        {/* Dynamic Grid Overlay */}
        <div className="map-grid-overlay" />

        {/* Conic Radar Sweep */}
        <div className="radar-sweep-effect" />

        {/* Tactical SVG Map */}
        <svg viewBox="0 0 650 300" style={{ width: "100%", height: "100%", position: "relative", zIndex: 2 }}>
          
          {/* Border Fence / Wall Line */}
          <motion.path 
            className="border-fence-line"
            d={borderFence} 
            stroke={isEmergencyMode ? "var(--danger)" : "var(--primary)"}
            style={{ color: isEmergencyMode ? "var(--danger)" : "var(--primary)" }}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
          />

          {/* Patrol Route path */}
          <path d={patrolRoute} className="patrol-route-line" />

          {/* Drones flying along path */}
          <motion.g
            animate={{
              x: [0, 160, 320, 480, 520, 320, 160, 0],
              y: [0, -60, 10, -40, -10, 10, -60, 0]
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <circle cx="80" cy="140" r="6" fill="var(--primary)" className="drone-tracker glow-pulse" />
            <circle cx="80" cy="140" r="14" fill="transparent" stroke="var(--primary)" strokeWidth="1" strokeDasharray="2 2" />
            <text x="80" y="125" fill="var(--primary)" fontSize="8" fontFamily="monospace" textAnchor="middle">DRONE-01</text>
          </motion.g>

          <motion.g
            animate={{
              x: [0, -140, -280, -320, -140, 0],
              y: [0, 80, -20, 10, 80, 0]
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <circle cx="500" cy="100" r="6" fill="var(--accent)" className="drone-tracker glow-pulse" />
            <circle cx="500" cy="100" r="14" fill="transparent" stroke="var(--accent)" strokeWidth="1" strokeDasharray="2 2" />
            <text x="500" y="85" fill="var(--accent)" fontSize="8" fontFamily="monospace" textAnchor="middle">DRONE-02</text>
          </motion.g>

          {/* Interactive Sensor Pins */}
          {mapSensors.map((sensor) => {
            const isSelected = activeSensor?.id === sensor.id;
            const markerColor = isEmergencyMode && sensor.id === "S-102" ? "var(--danger)" : sensor.color;

            return (
              <g key={sensor.id} className="sensor-pin" onClick={() => setActiveSensor(sensor)}>
                <circle 
                  cx={sensor.x} 
                  cy={sensor.y} 
                  r="6" 
                  fill={markerColor} 
                />
                <circle 
                  className="sensor-pin-pulse"
                  cx={sensor.x} 
                  cy={sensor.y} 
                  r="12" 
                  fill="transparent" 
                  stroke={markerColor} 
                  strokeWidth="1.5" 
                  style={{ color: markerColor }}
                />
                
                {isSelected && (
                  <circle cx={sensor.x} cy={sensor.y} r="18" fill="transparent" stroke="#fff" strokeWidth="1" strokeDasharray="2 2" />
                )}
                
                <text x={sensor.x} y={sensor.y - 14} fill="rgba(255,255,255,0.7)" fontSize="7" fontFamily="monospace" textAnchor="middle">
                  {sensor.id}
                </text>
              </g>
            );
          })}

        </svg>

        {/* Clicked Sensor Floating HUD */}
        {activeSensor && (
          <div 
            className="glass-pane"
            style={{
              position: "absolute",
              top: "16px",
              left: "16px",
              width: "200px",
              padding: "12px",
              background: "rgba(10,18,36,0.9)",
              border: "1px solid var(--primary)",
              borderRadius: "8px",
              zIndex: 10,
              fontSize: "11px",
              display: "flex",
              flexDirection: "column",
              gap: "6px"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "700", color: "var(--primary)" }}>
              <span>{activeSensor.id}</span>
              <button 
                onClick={(e) => { e.stopPropagation(); setActiveSensor(null); }}
                style={{ background: "none", border: "none", color: "#fff", cursor: "pointer" }}
              >
                ✕
              </button>
            </div>
            <div><strong>Label:</strong> {activeSensor.name}</div>
            <div>
              <strong>Status:</strong>{" "}
              <span style={{ color: activeSensor.status.includes("Anomaly") ? "var(--danger)" : "var(--success)" }}>
                {activeSensor.status}
              </span>
            </div>
            <div><strong>Core Temp:</strong> {activeSensor.temp}</div>
            <div><strong>Sector Coordinates:</strong> Sector-{activeSensor.id.split("-")[1]}</div>
          </div>
        )}

        {/* Coordinates Badge */}
        <div className="map-coords-badge">
          SECTOR: ALPHA-GRID | MAP ZOOM: 1.0X
        </div>
      </div>
    </motion.div>
  );
}

export default BorderMap;

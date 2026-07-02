import { motion } from "framer-motion";

function RestrictedZone({ isBreached }) {
  // Polygon coordinates mapped from 640x480 ratio to 100% SVG box (100x100 grid coords)
  // [(150, 150), (490, 150), (550, 420), (90, 420)] relative to 640x480
  // Mapped:
  // (150/640)*100 = 23.4% , (150/480)*100 = 31.2%
  // (490/640)*100 = 76.5% , (150/480)*100 = 31.2%
  // (550/640)*100 = 85.9% , (420/480)*100 = 87.5%
  // (90/640)*100  = 14.0% , (420/480)*100 = 87.5%
  const points = "23.4,31.2 76.5,31.2 85.9,87.5 14.0,87.5";

  return (
    <svg 
      viewBox="0 0 100 100" 
      preserveAspectRatio="none"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 12
      }}
    >
      <defs>
        <linearGradient id="polyGlow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={isBreached ? "var(--danger)" : "var(--primary)"} stopOpacity="0.1"/>
          <stop offset="100%" stopColor={isBreached ? "var(--danger)" : "var(--primary)"} stopOpacity="0.3"/>
        </linearGradient>
      </defs>
      
      {/* Restricted Boundary Polygon */}
      <motion.polygon
        points={points}
        fill="url(#polyGlow)"
        stroke={isBreached ? "var(--danger)" : "var(--primary)"}
        strokeWidth="1"
        strokeDasharray={isBreached ? "none" : "2 2"}
        animate={isBreached ? {
          strokeWidth: [1, 2, 1],
          opacity: [0.6, 1, 0.6]
        } : {}}
        transition={isBreached ? {
          duration: 1,
          repeat: Infinity,
          ease: "easeInOut"
        } : {}}
      />
      
      {/* Alert Warning Text inside Polygon center */}
      {isBreached && (
        <foreignObject x="30" y="55" width="40" height="15">
          <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "rgba(255, 77, 109, 0.8)",
            border: "1px solid var(--danger)",
            borderRadius: "4px",
            color: "#fff",
            fontSize: "6px",
            fontWeight: "700",
            padding: "2px",
            textAlign: "center",
            textTransform: "uppercase",
            boxShadow: "0 0 8px var(--danger)"
          }}>
            Restricted Zone Breach!
          </div>
        </foreignObject>
      )}
    </svg>
  );
}

export default RestrictedZone;

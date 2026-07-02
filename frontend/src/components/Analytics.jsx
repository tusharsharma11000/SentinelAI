import { motion } from "framer-motion";
import "./Analytics.css";

function Analytics() {
  // 1. Line Chart - Threat Timeline Data
  const threatTimelinePoints = "M 30 110 L 80 90 L 130 115 L 180 50 L 230 75 L 280 30 L 330 60";
  const threatTimelineFill = "M 30 110 L 80 90 L 130 115 L 180 50 L 230 75 L 280 30 L 330 60 L 330 130 L 30 130 Z";

  // 2. Bar Chart - Objects Detected Data
  const barData = [
    { label: "Person", value: 85, color: "var(--danger)" },
    { label: "Vehicle", value: 60, color: "var(--accent)" },
    { label: "Drone", value: 45, color: "var(--primary)" },
    { label: "Animal", value: 30, color: "var(--success)" },
    { label: "Unknown", value: 15, color: "var(--warning)" },
  ];

  // 3. Pie/Donut Chart - Detection Categories Data
  // Circumference of radius 30 circle = 2 * PI * 30 = 188.4
  const donutData = [
    { label: "Sect. A", percent: 45, offset: 0, color: "var(--primary)" },
    { label: "Sect. B", percent: 30, offset: 188.4 * 0.45, color: "var(--accent)" },
    { label: "Sect. C", percent: 15, offset: 188.4 * 0.75, color: "var(--success)" },
    { label: "Sect. D", percent: 10, offset: 188.4 * 0.90, color: "var(--warning)" },
  ];

  // 4. Area Chart - Camera Performance
  const camPerformancePoints = "M 30 100 Q 80 80, 130 95 T 230 40 T 330 85";
  const camPerformanceFill = "M 30 100 Q 80 80, 130 95 T 230 40 T 330 85 L 330 130 L 30 130 Z";

  return (
    <div className="analytics-grid">
      {/* 1. Line Chart: Threat Timeline */}
      <motion.div 
        className="glass-pane chart-card"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.05 }}
      >
        <span className="chart-title">Threat Incidents Timeline</span>
        <svg className="chart-container-svg" viewBox="0 0 360 150">
          <defs>
            <linearGradient id="timelineGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--danger)" stopOpacity="0.3"/>
              <stop offset="100%" stopColor="var(--danger)" stopOpacity="0"/>
            </linearGradient>
          </defs>
          {/* Grids */}
          <line x1="30" y1="30" x2="330" y2="30" className="grid-line" />
          <line x1="30" y1="80" x2="330" y2="80" className="grid-line" />
          <line x1="30" y1="130" x2="330" y2="130" className="grid-line" style={{ strokeDasharray: "none" }} />
          
          {/* Timeline Fill */}
          <path d={threatTimelineFill} fill="url(#timelineGrad)" />

          {/* Timeline Line */}
          <motion.path 
            d={threatTimelinePoints} 
            fill="none" 
            stroke="var(--danger)" 
            strokeWidth="2.5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.8, ease: "easeOut" }}
          />

          {/* Dots */}
          <circle cx="80" cy="90" r="4" fill="var(--danger)" />
          <circle cx="180" cy="50" r="4" fill="var(--danger)" />
          <circle cx="280" cy="30" r="4" fill="var(--danger)" />

          {/* Axes */}
          <text x="30" y="142" className="chart-axis-text">08:00</text>
          <text x="130" y="142" className="chart-axis-text">10:00</text>
          <text x="230" y="142" className="chart-axis-text">12:00</text>
          <text x="320" y="142" className="chart-axis-text">14:00</text>
        </svg>
      </motion.div>

      {/* 2. Bar Chart: Objects Detected */}
      <motion.div 
        className="glass-pane chart-card"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <span className="chart-title">Detections by Object Class</span>
        <svg className="chart-container-svg" viewBox="0 0 360 150">
          <line x1="30" y1="130" x2="330" y2="130" className="grid-line" style={{ strokeDasharray: "none" }} />
          {barData.map((bar, idx) => {
            const barWidth = 32;
            const x = 50 + idx * 56;
            const barHeight = (bar.value / 100) * 100;
            const y = 130 - barHeight;

            return (
              <g key={bar.label}>
                <motion.rect 
                  className="bar-chart-rect"
                  x={x}
                  y={130}
                  width={barWidth}
                  height={0}
                  fill={bar.color}
                  rx="3"
                  animate={{ y: y, height: barHeight }}
                  transition={{ duration: 1.2, ease: "easeOut", delay: idx * 0.1 }}
                />
                <text x={x + barWidth/2} y="142" className="chart-axis-text" textAnchor="middle">
                  {bar.label}
                </text>
                <text x={x + barWidth/2} y={y - 6} className="chart-axis-text" textAnchor="middle" fill="var(--text-main)" style={{ fontWeight: "700" }}>
                  {bar.value}
                </text>
              </g>
            );
          })}
        </svg>
      </motion.div>

      {/* 3. Donut Chart: Detection Categories */}
      <motion.div 
        className="glass-pane chart-card"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.15 }}
      >
        <span className="chart-title">Incidents by Sector Location</span>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "130px" }}>
          <svg className="chart-container-svg" viewBox="0 0 150 120" style={{ width: "120px", height: "120px" }}>
            <circle cx="75" cy="60" r="30" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
            {donutData.map((d, idx) => (
              <motion.circle 
                key={d.label}
                cx="75"
                cy="60"
                r="30"
                fill="transparent"
                stroke={d.color}
                strokeWidth="8"
                strokeDasharray="188.4"
                strokeDashoffset={188.4}
                style={{
                  transform: "rotate(-90deg)",
                  transformOrigin: "75px 60px",
                }}
                animate={{ strokeDashoffset: 188.4 - (188.4 * d.percent) / 100 }}
                transition={{ duration: 1.5, ease: "easeOut", delay: idx * 0.1 }}
              />
            ))}
          </svg>

          {/* Custom Donut Legend */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", width: "150px" }}>
            {donutData.map((d) => (
              <div key={d.label} className="legend-item">
                <span className="legend-color" style={{ background: d.color }}></span>
                <span style={{ fontWeight: "600", color: "var(--text-main)" }}>{d.label}:</span>
                <span>{d.percent}%</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* 4. Area Chart: Camera Performance */}
      <motion.div 
        className="glass-pane chart-card"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <span className="chart-title">AI Engine Pipeline Latency</span>
        <svg className="chart-container-svg" viewBox="0 0 360 150">
          <defs>
            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.25"/>
              <stop offset="100%" stopColor="var(--primary)" stopOpacity="0"/>
            </linearGradient>
          </defs>
          <line x1="30" y1="30" x2="330" y2="30" className="grid-line" />
          <line x1="30" y1="80" x2="330" y2="80" className="grid-line" />
          <line x1="30" y1="130" x2="330" y2="130" className="grid-line" style={{ strokeDasharray: "none" }} />
          
          <path d={camPerformanceFill} fill="url(#areaGrad)" />
          
          <motion.path 
            d={camPerformancePoints} 
            fill="none" 
            stroke="var(--primary)" 
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.8, ease: "easeOut" }}
          />

          <text x="30" y="142" className="chart-axis-text">CAM-01</text>
          <text x="130" y="142" className="chart-axis-text">CAM-02</text>
          <text x="230" y="142" className="chart-axis-text">CAM-03</text>
          <text x="320" y="142" className="chart-axis-text">CAM-04</text>
        </svg>
      </motion.div>
    </div>
  );
}

export default Analytics;

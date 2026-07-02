import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiVideo, FiBell, FiAlertCircle, FiTrendingUp } from "react-icons/fi";
import { useDashboard } from "../hooks/useDashboard";
import "./StatsCards.css";

// Helper hook for animating counters
function useCountUp(target, duration = 1000, start = true) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start || target === undefined || target === null) return;
    let startTime = null;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const rate = Math.min(progress / duration, 1);
      
      const easedRate = rate * (2 - rate);
      const current = Math.floor(easedRate * target);
      setCount(current);

      if (progress < duration) {
        requestAnimationFrame(animate);
      } else {
        setCount(target);
      }
    };

    requestAnimationFrame(animate);
  }, [target, duration, start]);

  return count;
}

// Skeleton layout for stats card
function StatSkeleton() {
  return (
    <div className="skeleton-card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div className="skeleton skeleton-text" style={{ width: "50%" }} />
        <div className="skeleton skeleton-circle" style={{ width: "24px", height: "24px" }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: "20px" }}>
        <div style={{ width: "60%" }}>
          <div className="skeleton skeleton-title" style={{ height: "28px", width: "80%", marginBottom: "5px" }} />
          <div className="skeleton skeleton-text" style={{ width: "60%" }} />
        </div>
        <div className="skeleton" style={{ width: "50px", height: "25px" }} />
      </div>
    </div>
  );
}

function StatsCards() {
  const { stats, loading } = useDashboard();
  
  const activeCams = stats?.activeCameras ?? 0;
  const alertsCount = stats?.activeAlerts ?? 0;
  const intrusionsCount = stats?.intrusions ?? 0;
  const accuracy = stats?.accuracy ?? 98;

  const camsCountVal = useCountUp(activeCams, 1000, !loading);
  const alertsCountVal = useCountUp(alertsCount, 1000, !loading);
  const intrusionsCountVal = useCountUp(intrusionsCount, 1000, !loading);
  const accuracyVal = useCountUp(accuracy, 1200, !loading);

  const sparklineData1 = "M 0 25 Q 15 5, 30 20 T 60 10 T 80 15";
  const sparklineData2 = "M 0 30 Q 10 30, 20 15 T 45 28 T 65 8 T 80 20";

  if (loading) {
    return (
      <div className="stats-grid">
        <StatSkeleton />
        <StatSkeleton />
        <StatSkeleton />
        <StatSkeleton />
      </div>
    );
  }

  return (
    <div className="stats-grid">
      
      {/* Active Cameras */}
      <motion.div 
        className="glass-pane stat-card neon-border-glowing"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
      >
        <div className="stat-header">
          <span className="stat-title">Active Feeds</span>
          <div className="stat-icon">
            <FiVideo />
          </div>
        </div>
        <div className="stat-body">
          <div className="stat-value-container">
            <span className="stat-value">{camsCountVal} / 4</span>
            <span className="stat-trend up">Online (100%)</span>
          </div>
          <svg className="stat-sparkline" viewBox="0 0 80 30">
            <motion.path 
              className="sparkline-path" 
              d={sparklineData1} 
              stroke="var(--primary)" 
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />
          </svg>
        </div>
      </motion.div>

      {/* AI Alerts */}
      <motion.div 
        className="glass-pane stat-card"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <div className="stat-header">
          <span className="stat-title">AI System Alerts</span>
          <div className={`stat-icon ${alertsCount > 0 ? "alert-active" : ""}`}>
            <FiBell />
          </div>
        </div>
        <div className="stat-body">
          <div className="stat-value-container">
            <span className="stat-value">{alertsCountVal}</span>
            <span className="stat-trend down">{alertsCount > 0 ? `+${alertsCount} active alarms` : "Zero pending"}</span>
          </div>
          <svg className="stat-sparkline" viewBox="0 0 80 30">
            <motion.path 
              className="sparkline-path" 
              d={sparklineData2} 
              stroke="var(--warning)" 
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />
          </svg>
        </div>
      </motion.div>

      {/* Border Intrusions */}
      <motion.div 
        className="glass-pane stat-card"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
      >
        <div className="stat-header">
          <span className="stat-title">Intrusions Log</span>
          <div className={`stat-icon ${intrusionsCount > 0 ? "danger-active" : ""}`}>
            <FiAlertCircle />
          </div>
        </div>
        <div className="stat-body">
          <div className="stat-value-container">
            <span className="stat-value" style={{ color: intrusionsCount > 0 ? "var(--danger)" : "inherit" }}>
              {intrusionsCountVal}
            </span>
            <span className="stat-trend" style={{ color: intrusionsCount > 0 ? "var(--danger)" : "var(--success)" }}>
              {intrusionsCount > 0 ? "⚠️ Critical Breaches" : "All Clear"}
            </span>
          </div>
          <div style={{ fontSize: "24px", color: intrusionsCount > 0 ? "var(--danger)" : "var(--success)" }}>
            🏃
          </div>
        </div>
      </motion.div>

      {/* Detection Accuracy */}
      <motion.div 
        className="glass-pane stat-card"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <div className="stat-header">
          <span className="stat-title">AI Accuracy</span>
          <div className="stat-icon" style={{ color: "var(--success)" }}>
            <FiTrendingUp />
          </div>
        </div>
        <div className="stat-body">
          <div className="stat-value-container">
            <span className="stat-value">{accuracyVal}%</span>
            <span className="stat-trend up">YOLOv8 & RT-DETR Core</span>
          </div>
          <div className="progress-ring-container">
            <svg width="50" height="50">
              <circle 
                cx="25" cy="25" r="20" 
                fill="transparent" 
                stroke="rgba(255,255,255,0.05)" 
                strokeWidth="4" 
              />
              <motion.circle 
                className="progress-ring-circle"
                cx="25" cy="25" r="20" 
                fill="transparent" 
                stroke="var(--success)" 
                strokeWidth="4" 
                strokeDasharray="125.6"
                initial={{ strokeDashoffset: 125.6 }}
                animate={{ strokeDashoffset: 125.6 - (125.6 * accuracy) / 100 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            </svg>
            <span className="progress-percentage">{accuracyVal}%</span>
          </div>
        </div>
      </motion.div>

    </div>
  );
}

export default StatsCards;

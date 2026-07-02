import { useState } from "react";
import { motion } from "framer-motion";
import { 
  FiHome, 
  FiVideo, 
  FiAlertTriangle, 
  FiBarChart2, 
  FiMap, 
  FiCpu, 
  FiFolder, 
  FiSettings, 
  FiLogOut,
  FiChevronLeft,
  FiChevronRight
} from "react-icons/fi";
import "./Sidebar.css";

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: <FiHome /> },
  { id: "cameras", label: "Cameras", icon: <FiVideo /> },
  { id: "alerts", label: "Alerts", icon: <FiAlertTriangle /> },
  { id: "analytics", label: "Analytics", icon: <FiBarChart2 /> },
  { id: "border-map", label: "Border Map", icon: <FiMap /> },
  { id: "ai-detection", label: "AI Detection", icon: <FiCpu /> },
  { id: "reports", label: "Reports", icon: <FiFolder /> },
  { id: "settings", label: "Settings", icon: <FiSettings /> },
];

function Sidebar({ activeTab, setActiveTab }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <motion.div 
      className={`sidebar ${isCollapsed ? "collapsed" : ""}`}
      layout
    >
      <div className="sidebar-header">
        <div className="logo-container" onClick={() => setActiveTab("dashboard")}>
          <motion.div 
            className="logo-icon"
            animate={{ 
              scale: [1, 1.08, 1],
              opacity: [0.9, 1, 0.9]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            🛡
          </motion.div>
          {!isCollapsed && (
            <motion.span 
              className="logo-text"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              SentinelAI
            </motion.span>
          )}
        </div>
        {!isCollapsed && (
          <span className="sidebar-subtitle">AI Border Surveillance</span>
        )}
      </div>

      <ul className="sidebar-menu">
        {menuItems.map((item) => (
          <li
            key={item.id}
            className={`menu-item ${activeTab === item.id ? "active" : ""}`}
            onClick={() => setActiveTab(item.id)}
          >
            <div className="menu-item-icon">{item.icon}</div>
            {!isCollapsed && (
              <span className="menu-item-text">{item.label}</span>
            )}
          </li>
        ))}
        
        {/* Toggle Collapse Button inside Menu list */}
        <li 
          className="menu-item toggle-btn-item"
          onClick={() => setIsCollapsed(!isCollapsed)}
          style={{ marginTop: "auto", borderTop: "1px solid var(--card-border)" }}
        >
          <div className="menu-item-icon">
            {isCollapsed ? <FiChevronRight /> : <FiChevronLeft />}
          </div>
          {!isCollapsed && (
            <span className="menu-item-text">Collapse Menu</span>
          )}
        </li>

        <li 
          className="menu-item logout-btn"
          onClick={() => alert("Logging out of SentinelAI Command...")}
          style={{ color: "var(--danger)" }}
        >
          <div className="menu-item-icon"><FiLogOut /></div>
          {!isCollapsed && (
            <span className="menu-item-text">Logout</span>
          )}
        </li>
      </ul>

      {/* Commander Profile Card */}
      <div className="commander-card">
        <div className="avatar-container">
          <img 
            src="https://images.unsplash.com/photo-1579038773867-044c48829161?auto=format&fit=crop&q=80&w=150" 
            alt="Commander Profile" 
            className="commander-avatar" 
          />
          <div className="status-dot"></div>
        </div>
        {!isCollapsed && (
          <div className="commander-info">
            <span className="commander-name">Cmdr. Alex Vance</span>
            <span className="commander-role">Sector Alpha</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default Sidebar;

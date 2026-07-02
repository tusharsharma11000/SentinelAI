import { useState, useEffect, useContext } from "react";
import { FiSearch, FiBell, FiSun, FiMoon, FiChevronDown, FiUser } from "react-icons/fi";
import { ThemeContext } from "../context/ThemeContext";
import { useDashboard } from "../hooks/useDashboard";
import "./Navbar.css";

function Navbar() {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const { bellCount, resetBell } = useDashboard();
  const [time, setTime] = useState("");
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
      
      const day = String(now.getDate()).padStart(2, "0");
      const month = months[now.getMonth()];
      const year = now.getFullYear();
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");

      setTime(`${day} ${month} ${year} | ${hours}:${minutes}:${seconds}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h1 className="navbar-title">Border Surveillance Dashboard</h1>
        <span className="navbar-subtitle">Real-time AI Threat Monitoring</span>
      </div>

      <div className="navbar-right">
        {/* Search */}
        <div className="search-container">
          <FiSearch className="search-icon" />
          <input 
            type="text" 
            placeholder="Search radar logs, cams, coordinates..." 
            className="search-input"
          />
        </div>

        {/* Live Date Time Terminal */}
        <div className="datetime-badge">
          <span className="datetime-pulse"></span>
          <span>{time}</span>
        </div>

        {/* Theme Toggle */}
        <button 
          className="navbar-btn" 
          onClick={toggleTheme} 
          title="Toggle system interface mode"
        >
          {isDarkMode ? <FiSun /> : <FiMoon />}
        </button>

        {/* Alerts Bell */}
        <button 
          className="navbar-btn" 
          onClick={resetBell}
          title="View critical alerts"
        >
          <FiBell />
          {bellCount > 0 && <span className="btn-badge">{bellCount}</span>}
        </button>

        {/* Commander Dropdown */}
        <div className="profile-dropdown-container" style={{ position: "relative" }}>
          <div 
            className="profile-dropdown-btn"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
          >
            <FiUser className="profile-icon" />
            <span className="profile-name">Vance.A</span>
            <FiChevronDown style={{ fontSize: "12px", color: "var(--text-muted)" }} />
          </div>

          {showProfileMenu && (
            <div 
              className="glass-pane"
              style={{
                position: "absolute",
                top: "50px",
                right: 0,
                width: "160px",
                padding: "8px",
                borderRadius: "var(--radius-sm)",
                display: "flex",
                flexDirection: "column",
                gap: "4px",
                zIndex: 99
              }}
            >
              <div 
                className="menu-item"
                style={{ padding: "8px 12px", fontSize: "12px" }}
                onClick={() => { alert("Navigating to Commander Bio..."); setShowProfileMenu(false); }}
              >
                Profile Details
              </div>
              <div 
                className="menu-item"
                style={{ padding: "8px 12px", fontSize: "12px" }}
                onClick={() => { alert("Diagnostics running..."); setShowProfileMenu(false); }}
              >
                System Integrity
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

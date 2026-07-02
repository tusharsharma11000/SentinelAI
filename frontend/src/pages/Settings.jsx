import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import "./Settings.css";

function Settings() {
  const { user } = useContext(AuthContext);
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  
  const [confidence, setConfidence] = useState(0.85);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    alert("Profile parameters updated in temporary cache registry.");
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passcodes do not match!");
      return;
    }
    alert("Security credentials refreshed.");
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="settings-layout">
      <div className="settings-header-row">
        <h1 className="settings-page-title">Surveillance Configuration Deck</h1>
      </div>

      <div className="settings-grid">
        {/* Left column: AI threshold & System switches */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          
          {/* AI Settings */}
          <div className="glass-pane settings-group-card">
            <h2 className="settings-card-title">AI Engine Settings</h2>
            
            <div className="filter-group">
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px" }}>
                <span>Inference Confidence Limit</span>
                <strong style={{ color: "var(--primary)" }}>{(confidence * 100).toFixed(0)}% Match</strong>
              </div>
              <input 
                type="range" 
                min="0.5" 
                max="0.99" 
                step="0.01" 
                value={confidence}
                onChange={(e) => setConfidence(parseFloat(e.target.value))}
                style={{ accentColor: "var(--primary)", width: "100%", height: "4px", cursor: "pointer" }}
              />
            </div>
          </div>

          {/* Sound & Appearance settings */}
          <div className="glass-pane settings-group-card">
            <h2 className="settings-card-title">Alert & HUD Preferences</h2>
            
            <div className="settings-control-row">
              <div>
                <span style={{ fontSize: "13px", fontWeight: "600", color: "#fff" }}>Tactical Sound Matrix</span>
                <p style={{ fontSize: "10px", color: "var(--text-muted)", marginTop: "2px" }}>Play warning alarm sounds on restricted zone breach.</p>
              </div>
              <label className="toggle-switch-wrapper">
                <input 
                  type="checkbox" 
                  className="toggle-switch-input"
                  checked={soundEnabled}
                  onChange={() => setSoundEnabled(!soundEnabled)}
                />
                <span className="toggle-switch-slider"></span>
              </label>
            </div>

            <div className="settings-control-row">
              <div>
                <span style={{ fontSize: "13px", fontWeight: "600", color: "#fff" }}>HUD System Interface</span>
                <p style={{ fontSize: "10px", color: "var(--text-muted)", marginTop: "2px" }}>Toggle between dark surveillance mode and daytime HUD colors.</p>
              </div>
              <label className="toggle-switch-wrapper">
                <input 
                  type="checkbox" 
                  className="toggle-switch-input"
                  checked={!isDarkMode}
                  onChange={toggleTheme}
                />
                <span className="toggle-switch-slider"></span>
              </label>
            </div>
          </div>

        </div>

        {/* Right column: Profile & Passcode settings */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          
          {/* Profile controls */}
          <form onSubmit={handleProfileSubmit} className="glass-pane settings-group-card">
            <h2 className="settings-card-title">Commander Profile Settings</h2>
            
            <div className="filter-group">
              <label className="form-label">Full Name</label>
              <input 
                type="text" 
                className="filter-input" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required
              />
            </div>

            <div className="filter-group">
              <label className="form-label">Surveillance Registry Email</label>
              <input 
                type="email" 
                className="filter-input" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required
              />
            </div>

            <button type="submit" className="cyber-btn cyber-btn-primary" style={{ alignSelf: "flex-end" }}>
              Update Profile details
            </button>
          </form>

          {/* Passcode Reset */}
          <form onSubmit={handlePasswordSubmit} className="glass-pane settings-group-card">
            <h2 className="settings-card-title">Change Console Passcode</h2>
            
            <div className="filter-group">
              <label className="form-label">New Passcode</label>
              <input 
                type="password" 
                className="filter-input" 
                placeholder="Enter new code"
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required
              />
            </div>

            <div className="filter-group">
              <label className="form-label">Confirm New Passcode</label>
              <input 
                type="password" 
                className="filter-input" 
                placeholder="Verify new code"
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                required
              />
            </div>

            <button type="submit" className="cyber-btn" style={{ alignSelf: "flex-end" }}>
              Refresh Credentials
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}

export default Settings;

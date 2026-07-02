import { useState } from "react";
import { useCamera } from "../hooks/useCamera";
import "./Cameras.css";

function Cameras() {
  const { cameras, loading, addCamera, deleteCamera } = useCamera();
  const [detectionStates, setDetectionStates] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCamName, setNewCamName] = useState("");
  const [newCamLoc, setNewCamLoc] = useState("");

  const toggleDetection = (camId) => {
    setDetectionStates(prev => ({
      ...prev,
      [camId]: prev[camId] === "Paused" ? "Active" : "Paused"
    }));
  };

  const handleAddCameraSubmit = async (e) => {
    e.preventDefault();
    if (!newCamName || !newCamLoc) return;
    try {
      await addCamera({
        name: newCamName,
        location: newCamLoc,
        status: "active",
        resolution: "1080p",
        fps: 60
      });
      setNewCamName("");
      setNewCamLoc("");
      setShowAddForm(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="cameras-layout">
      <div className="cameras-header-row">
        <h1 className="cameras-page-title">Surveillance Feed Matrix</h1>
        <button className="cyber-btn cyber-btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? "Hide Form" : "Add Surveillance Sector"}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAddCameraSubmit} className="glass-pane" style={{ padding: "20px", display: "flex", gap: "16px", alignItems: "flex-end" }}>
          <div className="filter-group" style={{ flexGrow: 1 }}>
            <label className="form-label">Sector Name</label>
            <input 
              type="text" 
              className="filter-input" 
              placeholder="e.g. Sector Zeta-09"
              value={newCamName}
              onChange={(e) => setNewCamName(e.target.value)}
              required
            />
          </div>
          <div className="filter-group" style={{ flexGrow: 1 }}>
            <label className="form-label">Coordinates</label>
            <input 
              type="text" 
              className="filter-input" 
              placeholder="e.g. 32.799 N, 104.950 W"
              value={newCamLoc}
              onChange={(e) => setNewCamLoc(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="cyber-btn cyber-btn-primary" style={{ padding: "10px 20px" }}>
            Add
          </button>
        </form>
      )}

      {loading ? (
        <div className="cameras-grid">
          {[1, 2].map(i => (
            <div key={i} className="skeleton-card" style={{ height: "180px" }} />
          ))}
        </div>
      ) : (
        <div className="cameras-grid">
          {cameras.map((cam) => {
            const isOnline = cam.status === "active";
            const detectionStatus = detectionStates[cam._id] || "Active";
            
            return (
              <div key={cam._id} className="glass-pane camera-grid-card">
                <div className="camera-card-top">
                  <div className="camera-card-info-header">
                    <span className="camera-card-name">{cam.name}</span>
                    <p style={{ fontSize: "10px", color: "var(--text-muted)", marginTop: "2px" }}>{cam.location}</p>
                  </div>
                  <span className={`camera-card-status ${isOnline ? "active" : "offline"}`}>
                    {isOnline ? "🟢 Online" : "🔴 Offline"}
                  </span>
                </div>

                <div className="camera-card-mid">
                  <div className="camera-card-field">
                    <span style={{ fontSize: "9px" }}>FPS</span>
                    <span className="camera-card-val">{isOnline ? cam.fps : 0} FPS</span>
                  </div>
                  <div className="camera-card-field">
                    <span style={{ fontSize: "9px" }}>RESOLUTION</span>
                    <span className="camera-card-val">{cam.resolution}</span>
                  </div>
                  <div className="camera-card-field">
                    <span style={{ fontSize: "9px" }}>AI STATUS</span>
                    <span 
                      className="camera-card-val"
                      style={{ color: detectionStatus === "Active" ? "var(--success)" : "var(--warning)" }}
                    >
                      {detectionStatus}
                    </span>
                  </div>
                </div>

                <div className="camera-card-bottom">
                  {isOnline && (
                    <button 
                      className={`camera-action-btn ${detectionStatus === "Active" ? "active" : ""}`}
                      onClick={() => toggleDetection(cam._id)}
                    >
                      {detectionStatus === "Active" ? "Pause Detection" : "Resume Detection"}
                    </button>
                  )}
                  <button 
                    className="camera-action-btn" 
                    onClick={() => deleteCamera(cam._id)}
                    style={{ borderColor: "rgba(255, 77, 109, 0.3)", color: "var(--danger)" }}
                  >
                    Delete Sector
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Cameras;

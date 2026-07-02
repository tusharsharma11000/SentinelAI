import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../services/api";
import "./History.css";

function History() {
  const [detections, setDetections] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [alertLevel, setAlertLevel] = useState("all");
  const [camera, setCamera] = useState("all");
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const response = await api.get("/detections", {
        params: {
          page,
          limit: 10,
          search,
          alertLevel,
          camera
        }
      });
      
      setDetections(response.data.data);
      setPages(response.data.pages);
      setTotal(response.data.total);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Failed to link history records database.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [page, alertLevel, camera]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchHistory();
  };

  return (
    <div className="history-layout">
      <div className="history-header-row">
        <h1 className="history-page-title">Surveillance Detection Log Database</h1>
        <span className="pagination-info">Total Logs: {total}</span>
      </div>

      {/* Filter and Search Panel */}
      <form onSubmit={handleSearchSubmit} className="history-filter-panel">
        <div className="filter-group">
          <label className="form-label">Search Index</label>
          <input 
            type="text" 
            className="filter-input" 
            placeholder="Search object types or camera sectors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label className="form-label">Threat Classification</label>
          <select 
            className="filter-select"
            value={alertLevel}
            onChange={(e) => { setAlertLevel(e.target.value); setPage(1); }}
          >
            <option value="all">All Levels</option>
            <option value="HIGH ALERT">High Alert</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>

        <div className="filter-group">
          <label className="form-label">Sectors</label>
          <select 
            className="filter-select"
            value={camera}
            onChange={(e) => { setCamera(e.target.value); setPage(1); }}
          >
            <option value="all">All Sectors</option>
            <option value="Sector Alpha-12 (North)">Sector Alpha-12 (North)</option>
            <option value="Sector Bravo-05 (Gate East)">Sector Bravo-05 (Gate East)</option>
            <option value="Sector Delta-08 (Canyon)">Sector Delta-08 (Canyon)</option>
            <option value="Sector Echo-10 (Highway)">Sector Echo-10 (Highway)</option>
          </select>
        </div>
      </form>

      {/* Main Table Grid Card */}
      <div className="glass-pane" style={{ padding: "20px" }}>
        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="skeleton" style={{ height: "40px", width: "100%" }} />
            ))}
          </div>
        ) : error ? (
          <div style={{ color: "var(--danger)", textAlign: "center", padding: "40px" }}>
            {error}
          </div>
        ) : (
          <div className="table-container">
            <table className="cyber-table">
              <thead>
                <tr>
                  <th>Detection ID</th>
                  <th>Object</th>
                  <th>Confidence</th>
                  <th>Camera</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Alert Level</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence mode="popLayout">
                  {detections.map((item, idx) => {
                    const dateObj = new Date(item.timestamp);
                    const formattedDate = dateObj.toLocaleDateString();
                    const formattedTime = dateObj.toLocaleTimeString();

                    return (
                      <motion.tr 
                        key={item._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <td style={{ fontFamily: "monospace" }}>#{1001 + idx + (page-1)*10}</td>
                        <td style={{ fontWeight: "700" }}>{item.object.toUpperCase()}</td>
                        <td style={{ fontFamily: "monospace" }}>{Math.round(item.confidence * 100)}%</td>
                        <td>{item.camera}</td>
                        <td style={{ color: "var(--text-muted)" }}>{formattedDate}</td>
                        <td style={{ color: "var(--text-muted)", fontFamily: "monospace" }}>{formattedTime}</td>
                        <td>
                          <span 
                            className={`threat-badge`}
                            style={{
                              color: item.alertLevel === "HIGH ALERT" 
                                ? "var(--danger)" 
                                : item.alertLevel === "LOW" 
                                ? "var(--success)" 
                                : "var(--warning)",
                              borderColor: item.alertLevel === "HIGH ALERT" 
                                ? "var(--danger)" 
                                : item.alertLevel === "LOW" 
                                ? "var(--success)" 
                                : "var(--warning)",
                              borderWidth: "1px",
                              borderStyle: "solid",
                              padding: "2px 6px",
                              borderRadius: "4px",
                              fontSize: "9px",
                              fontWeight: "700"
                            }}
                          >
                            {item.alertLevel}
                          </span>
                        </td>
                      </motion.tr>
                    );
                  })}
                  {detections.length === 0 && (
                    <tr>
                      <td colSpan="7" style={{ textAlign: "center", color: "var(--text-muted)", padding: "20px" }}>
                        No matching telemetry files indexed.
                      </td>
                    </tr>
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      <div className="pagination-controls">
        <button 
          className="pagination-btn"
          onClick={() => setPage(prev => Math.max(prev - 1, 1))}
          disabled={page === 1}
        >
          Previous Channel
        </button>
        <span className="pagination-info">Sector Page {page} of {pages}</span>
        <button 
          className="pagination-btn"
          onClick={() => setPage(prev => Math.min(prev + 1, pages))}
          disabled={page === pages}
        >
          Next Channel
        </button>
      </div>
    </div>
  );
}

export default History;

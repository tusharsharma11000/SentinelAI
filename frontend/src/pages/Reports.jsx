import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import api from "../services/api";
import "./Reports.css";

function Reports() {
  const [reportType, setReportType] = useState("daily");
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [logs, setLogs] = useState([
    "REP_INIT: Compiling security metrics catalog.",
    "DB_PULL: Queried alarm log history segments.",
    "MATH_ENG: Computed yolo classification distributions."
  ]);

  const fetchReportsData = async () => {
    setLoading(true);
    try {
      const response = await api.get("/reports");
      setMetrics(response.data);
      
      const timeStamp = new Date().toLocaleTimeString();
      setLogs(prev => [
        `[${timeStamp}] REP_GEN: Compiled ${reportType.toUpperCase()} surveillance audit logs successfully.`,
        ...prev
      ]);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch reports telemetry summary.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportsData();
  }, [reportType]);

  const handleExportCSV = () => {
    if (!metrics) return;
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Metric,Value\n";
    csvContent += `Total Detections,${metrics.totalDetections}\n`;
    csvContent += `Critical Threat Alerts,${metrics.threats}\n`;
    csvContent += `Resolved Alarms,${metrics.resolvedThreats}\n`;
    csvContent += `Neural Net Accuracy,${metrics.accuracy}%\n`;
    csvContent += `Average AI Confidence,${metrics.averageConfidence}%\n`;
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `sentinelai_${reportType}_report_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPDF = () => {
    window.print();
  };

  return (
    <div className="reports-layout">
      <div className="reports-header-row">
        <h1 className="reports-page-title">Surveillance Reports & Export Center</h1>
        <div className="reports-type-selectors">
          <button 
            className={`report-type-btn ${reportType === "daily" ? "active" : ""}`}
            onClick={() => setReportType("daily")}
          >
            Daily Report
          </button>
          <button 
            className={`report-type-btn ${reportType === "weekly" ? "active" : ""}`}
            onClick={() => setReportType("weekly")}
          >
            Weekly Report
          </button>
          <button 
            className={`report-type-btn ${reportType === "monthly" ? "active" : ""}`}
            onClick={() => setReportType("monthly")}
          >
            Monthly Report
          </button>
        </div>
      </div>

      {loading ? (
        <div className="reports-grid">
          {[1, 2, 3].map(i => (
            <div key={i} className="skeleton-card" style={{ height: "120px" }} />
          ))}
        </div>
      ) : error ? (
        <div style={{ color: "var(--danger)", textAlign: "center", padding: "40px" }}>
          {error}
        </div>
      ) : (
        <div className="reports-grid">
          <div className="glass-pane" style={{ padding: "20px" }}>
            <span style={{ fontSize: "10px", color: "var(--text-muted)", textTransform: "uppercase" }}>Total Detections Logged</span>
            <div style={{ fontSize: "28px", fontWeight: "700", color: "var(--primary)", marginTop: "6px" }}>
              {metrics.totalDetections}
            </div>
            <span style={{ fontSize: "9px", color: "var(--success)" }}>🟢 Database Optimal</span>
          </div>

          <div className="glass-pane" style={{ padding: "20px" }}>
            <span style={{ fontSize: "10px", color: "var(--text-muted)", textTransform: "uppercase" }}>Critical Escapes / Threats</span>
            <div style={{ fontSize: "28px", fontWeight: "700", color: "var(--danger)", marginTop: "6px" }}>
              {metrics.threats}
            </div>
            <span style={{ fontSize: "9px", color: "var(--text-muted)" }}>{metrics.resolvedThreats} cases resolved</span>
          </div>

          <div className="glass-pane" style={{ padding: "20px" }}>
            <span style={{ fontSize: "10px", color: "var(--text-muted)", textTransform: "uppercase" }}>Avg Confidence Target</span>
            <div style={{ fontSize: "28px", fontWeight: "700", color: "var(--accent)", marginTop: "6px" }}>
              {metrics.averageConfidence}%
            </div>
            <span style={{ fontSize: "9px", color: "var(--primary)" }}>YOLOv8 & ByteTrack Core</span>
          </div>
        </div>
      )}

      {/* Live Logger panel */}
      <div className="glass-pane" style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
        <h3 style={{ fontSize: "13px", color: "var(--primary)", textTransform: "uppercase", letterSpacing: "1px" }}>
          Live Log Stream Compiler Output
        </h3>
        
        <div className="reports-logger-pane">
          {logs.map((log, idx) => (
            <div key={idx} style={{ borderLeft: "2px solid var(--primary)", paddingLeft: "8px" }}>
              {log}
            </div>
          ))}
        </div>

        <div className="reports-action-bar">
          <button className="cyber-btn" onClick={handleExportCSV}>
            Download CSV Dataset
          </button>
          <button className="cyber-btn cyber-btn-primary" onClick={handleExportPDF}>
            Export PDF Print Summary
          </button>
        </div>
      </div>
    </div>
  );
}

export default Reports;

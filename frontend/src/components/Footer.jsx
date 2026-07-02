import { useState, useEffect } from "react";
import "./Footer.css";

function Footer() {
  const [latency, setLatency] = useState(12);

  // Dynamic latency fluctuation to simulate real-time socket connections
  useEffect(() => {
    const interval = setInterval(() => {
      setLatency(prev => {
        const diff = Math.random() > 0.5 ? 1 : -1;
        const next = prev + diff;
        return next > 25 || next < 4 ? 12 : next;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="footer">
      <div className="footer-left">
        <span className="footer-item">SentinelAI core: v2.4.9-prod</span>
        <span className="footer-item">
          <span className="footer-status-dot pulse" /> SERVER: CONNECTED
        </span>
        <span className="footer-item">
          <span className="footer-status-dot" /> DATABASE: OPTIMAL
        </span>
      </div>

      <div className="footer-right">
        <span className="footer-item">MODEL: YOLOv8x-SURVEILLANCE + RT-DETR-L</span>
        <span className="footer-item">
          API LATENCY: <span className="footer-latency">{latency}ms</span>
        </span>
        <span className="footer-item">SECURE ENCRYPT: AES-256</span>
      </div>
    </footer>
  );
}

export default Footer;

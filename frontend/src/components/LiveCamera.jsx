import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { FiCamera, FiMaximize, FiMinimize } from "react-icons/fi";
import { io } from "socket.io-client";
import { useCamera } from "../hooks/useCamera";
import RestrictedZone from "./RestrictedZone";
import "./LiveCamera.css";

function LiveCamera() {
  const { cameras, loading, error: camError } = useCamera();
  const [selectedCam, setSelectedCam] = useState(null);
  const [useWebcam, setUseWebcam] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [streamError, setStreamError] = useState(false);
  const [isZoneBreached, setIsZoneBreached] = useState(false);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const webcamStreamRef = useRef(null);

  // Default select first camera once database records load
  useEffect(() => {
    if (cameras && cameras.length > 0 && !selectedCam) {
      setSelectedCam(cameras[0]);
    }
  }, [cameras, selectedCam]);

  // WebSocket hook to capture live breach alarms
  useEffect(() => {
    const socket = io("http://localhost:5000");

    socket.on("new-detection", (data) => {
      if (data.restrictedZoneBreach) {
        setIsZoneBreached(true);
        setTimeout(() => setIsZoneBreached(false), 2000);
      }
    });

    socket.on("new-alert", () => {
      setIsZoneBreached(true);
      setTimeout(() => setIsZoneBreached(false), 2500);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Attempt to start local Browser Webcam if server feed fails
  useEffect(() => {
    async function initWebcam() {
      if (!useWebcam || !streamError) return;
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        webcamStreamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.warn("Webcam access denied, falling back to simulated tactical feeds", err);
        setUseWebcam(false);
      }
    }
    
    initWebcam();
    return () => {
      if (webcamStreamRef.current) {
        webcamStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [useWebcam, streamError]);

  // Canvas drawing loop (Simulated HUD & Bounding Boxes)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !selectedCam) return;
    const ctx = canvas.getContext("2d");
    let width = canvas.width = canvas.offsetWidth;
    let height = canvas.height = canvas.offsetHeight;

    // Simulated Target positions
    const targets = [
      { id: 1, label: "Person", conf: 98.4, x: 200, y: 120, dx: 1.2, dy: 0.6, w: 80, h: 180 },
      { id: 2, label: "Drone", conf: 94.2, x: 450, y: 80, dx: -1.8, dy: -0.4, w: 60, h: 50 },
      { id: 3, label: "Vehicle", conf: 97.6, x: 100, y: 220, dx: 0.8, dy: 0.2, w: 150, h: 100 }
    ];

    let frame = 0;
    
    const draw = () => {
      frame++;
      ctx.clearRect(0, 0, width, height);

      // Handle Resize
      if (canvas.width !== canvas.offsetWidth || canvas.height !== canvas.offsetHeight) {
        width = canvas.width = canvas.offsetWidth;
        height = canvas.height = canvas.offsetHeight;
      }

      // Draw Simulated Video Background if NOT using webcam
      if (!useWebcam) {
        ctx.fillStyle = "#03060f";
        ctx.fillRect(0, 0, width, height);

        // Draw tactical radar lines
        ctx.strokeStyle = "rgba(0, 229, 255, 0.03)";
        ctx.lineWidth = 1;
        for (let i = 0; i < width; i += 40) {
          ctx.beginPath();
          ctx.moveTo(i, 0);
          ctx.lineTo(i, height);
          ctx.stroke();
        }
        for (let j = 0; j < height; j += 40) {
          ctx.beginPath();
          ctx.moveTo(0, j);
          ctx.lineTo(width, j);
          ctx.stroke();
        }

        // Draw Thermal / Infrared Color filters depending on selected camera status
        if (selectedCam.name.includes("Alpha")) {
          ctx.fillStyle = "rgba(0, 229, 255, 0.04)";
          ctx.fillRect(0, 0, width, height);
        } else if (selectedCam.name.includes("Bravo")) {
          ctx.fillStyle = "rgba(0, 210, 106, 0.05)";
          ctx.fillRect(0, 0, width, height);
        } else {
          ctx.fillStyle = "rgba(91, 92, 255, 0.05)";
          ctx.fillRect(0, 0, width, height);
        }
      }

      // 1. Draw Target Bounding Boxes (Only if in simulation mode or local browser fallback feed)
      if (!useWebcam || streamError) {
        targets.forEach((target) => {
          if (selectedCam.name.includes("Alpha") && target.label === "Vehicle") return;
          if (selectedCam.name.includes("Bravo") && target.label === "Person") return;
          if (selectedCam.name.includes("Delta") && target.label === "Drone") return;

          // Move targets
          target.x += target.dx;
          target.y += target.dy;

          // Bound checks
          if (target.x < 50 || target.x > width - 150) target.dx *= -1;
          if (target.y < 50 || target.y > height - 150) target.dy *= -1;

          let drawColor = "var(--primary)";
          if (selectedCam.name.includes("Bravo")) drawColor = "var(--success)";
          if (selectedCam.name.includes("Delta")) drawColor = "var(--accent)";
          if (selectedCam.name.includes("Alpha") && target.label === "Person") drawColor = "var(--danger)"; // High risk person alert

          ctx.strokeStyle = drawColor;
          ctx.lineWidth = 2;
          ctx.setLineDash([]);
          
          const gap = 15;
          const { x, y, w, h } = target;
          
          // Draw corners
          ctx.beginPath(); ctx.moveTo(x + gap, y); ctx.lineTo(x, y); ctx.lineTo(x, y + gap); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(x + w - gap, y); ctx.lineTo(x + w, y); ctx.lineTo(x + w, y + gap); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(x + gap, y + h); ctx.lineTo(x, y + h); ctx.lineTo(x, y + gap + h); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(x + w - gap, y + h); ctx.lineTo(x + w, y + h); ctx.lineTo(x + w, y + gap + h); ctx.stroke();

          ctx.beginPath();
          ctx.arc(x + w/2, y + h/2, 4, 0, Math.PI * 2);
          ctx.fillStyle = drawColor;
          ctx.fill();

          ctx.fillStyle = drawColor;
          ctx.font = "bold 10px Poppins";
          const txt = `${target.label.toUpperCase()} [${target.conf}%]`;
          const textWidth = ctx.measureText(txt).width;
          ctx.fillRect(x, y - 18, textWidth + 10, 18);

          ctx.fillStyle = "#000000";
          ctx.fillText(txt, x + 5, y - 5);
        });
      }

      // 2. Draw HUD Scanning Crosshair in center
      ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      
      ctx.beginPath(); ctx.moveTo(width / 2, 0); ctx.lineTo(width / 2, height); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, height / 2); ctx.lineTo(width, height / 2); ctx.stroke();
      
      ctx.beginPath(); ctx.arc(width/2, height/2, 100, 0, Math.PI * 2); ctx.stroke();

      const scanY = (frame * 1.5) % height;
      ctx.fillStyle = "rgba(0, 229, 255, 0.06)";
      ctx.fillRect(0, scanY, width, 2);

      // Coordinates Overlay
      ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
      ctx.font = "bold 9px Courier New";
      ctx.setLineDash([]);
      ctx.fillText(`SYS.CCTV_INPUT: ${useWebcam ? "ACTIVE WEBCAM STREAM" : "SIMULATED TACTICAL FEED"}`, 20, height - 55);
      ctx.fillText(`SYS.SECTOR_LOCK: TRUE`, 20, height - 40);
      ctx.fillText(`LAT_LNG: ${selectedCam.location}`, 20, height - 25);
      ctx.fillText(`TIME: ${new Date().toISOString()}`, 20, height - 10);

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animationRef.current);
  }, [selectedCam, useWebcam, streamError]);

  const triggerSnapshot = () => {
    if (selectedCam) {
      alert(`Snapshot captured for Sector ${selectedCam.name}. Saving metadata to alerts system.`);
    }
  };

  if (loading || !selectedCam) {
    return (
      <div className="glass-pane camera-card" style={{ height: "450px" }}>
        <div className="skeleton-card" style={{ height: "100%", width: "100%" }} />
      </div>
    );
  }

  return (
    <div className="glass-pane camera-card">
      <div className="camera-header">
        <div className="camera-meta">
          <span className="camera-title">{selectedCam.name}</span>
          <span className="camera-specs">
            {selectedCam.resolution} | {selectedCam.fps} FPS | {selectedCam.location}
          </span>
        </div>
        <div className="camera-controls">
          <select 
            className="camera-select"
            value={selectedCam._id}
            onChange={(e) => setSelectedCam(cameras.find(c => c._id === e.target.value))}
          >
            {cameras.map(cam => (
              <option key={cam._id} value={cam._id}>{cam.name}</option>
            ))}
          </select>
          <button 
            className="camera-select" 
            onClick={() => {
              setUseWebcam(!useWebcam);
              setStreamError(false);
            }}
            style={{ borderColor: useWebcam ? "var(--success)" : "var(--card-border)" }}
          >
            {useWebcam ? "Disable Live Feed" : "Use Real Camera"}
          </button>
        </div>
      </div>

      {/* Screen Frame */}
      <div className={`video-wrapper ${isFullscreen ? "fullscreen" : ""} ${isZoneBreached ? "breached-alarm-active" : ""}`}>
        {/* Live Indicator */}
        <div className="video-hud-badge live-badge">
          <span className="live-badge-dot"></span>
          <span>LIVE</span>
        </div>

        {/* FPS Indicator */}
        <div className="video-hud-badge fps-badge">
          <span>{selectedCam.fps} FPS</span>
        </div>

        {/* Bounding box canvas */}
        <canvas ref={canvasRef} className="video-overlay-canvas" />
        
        {/* Polygon overlay */}
        <RestrictedZone isBreached={isZoneBreached} />

        {/* Video feed element */}
        {useWebcam && !streamError ? (
          <img 
            src="http://localhost:8000/video_feed" 
            className="camera-video" 
            alt="AI Server CCTV Stream"
            onError={() => {
              console.warn("AI Detection Server offline, falling back to local raw feed.");
              setStreamError(true);
            }}
          />
        ) : useWebcam && streamError ? (
          <video 
            ref={videoRef} 
            className="camera-video" 
            autoPlay 
            playsInline 
            muted 
          />
        ) : null}

        {/* Action Overlay Buttons */}
        <div className="video-action-btns">
          <button className="video-hud-btn" onClick={triggerSnapshot} title="Capture Frame">
            <FiCamera />
          </button>
          <button className="video-hud-btn" onClick={() => setIsFullscreen(!isFullscreen)} title="Toggle Fullscreen">
            {isFullscreen ? "✕" : <FiMaximize />}
          </button>
        </div>
      </div>

      {/* Carousel Selector */}
      <div className="camera-carousel">
        {cameras.map(cam => (
          <div 
            key={cam._id} 
            className={`carousel-item ${selectedCam._id === cam._id ? "active" : ""}`}
            onClick={() => setSelectedCam(cam)}
          >
            <div className="carousel-thumb-canvas" style={{
              background: cam.status === "offline"
                ? "#250000"
                : cam.name.includes("Alpha")
                ? "linear-gradient(45deg, #090e1a, rgba(0,229,255,0.15))"
                : cam.name.includes("Bravo")
                ? "linear-gradient(45deg, #090e1a, rgba(0,210,106,0.15))"
                : "linear-gradient(45deg, #090e1a, rgba(91,92,255,0.15))"
            }} />
            <span className="carousel-item-title">{cam.name.split(" ")[1]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LiveCamera;

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { FiCamera, FiMaximize, FiMinimize, FiChevronRight, FiChevronLeft } from "react-icons/fi";
import "./LiveCamera.css";

const cameras = [
  { id: "cam-1", name: "Sector Alpha-12 (North)", fps: 60, res: "1920x1080", coord: "32.784° N, 104.982° W", type: "thermal" },
  { id: "cam-2", name: "Sector Bravo-05 (Gate East)", fps: 30, res: "1280x720", coord: "32.788° N, 104.975° W", type: "nightvision" },
  { id: "cam-3", name: "Sector Delta-08 (Canyon)", fps: 60, res: "1920x1080", coord: "32.772° N, 104.991° W", type: "radar" },
];

function LiveCamera() {
  const [selectedCam, setSelectedCam] = useState(cameras[0]);
  const [useWebcam, setUseWebcam] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [streamError, setStreamError] = useState(false);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const webcamStreamRef = useRef(null);

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
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let width = canvas.width = canvas.offsetWidth;
    let height = canvas.height = canvas.offsetHeight;

    // Simulated Target positions
    const targets = [
      { id: 1, label: "Person", conf: 98.4, x: 200, y: 150, dx: 1.2, dy: 0.6, w: 80, h: 180 },
      { id: 2, label: "Drone", conf: 94.2, x: 500, y: 80, dx: -1.8, dy: -0.4, w: 60, h: 50 },
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

        // Draw Thermal / Infrared Color filters depending on selected camera
        if (selectedCam.type === "thermal") {
          ctx.fillStyle = "rgba(0, 229, 255, 0.04)";
          ctx.fillRect(0, 0, width, height);
        } else if (selectedCam.type === "nightvision") {
          ctx.fillStyle = "rgba(0, 210, 106, 0.05)";
          ctx.fillRect(0, 0, width, height);
        } else {
          ctx.fillStyle = "rgba(91, 92, 255, 0.05)";
          ctx.fillRect(0, 0, width, height);
        }
      }

      // 1. Draw Target Bounding Boxes (Only if in simulation mode or local browser fallback feed)
      if (!useWebcam || streamError) {
        targets.forEach((target, index) => {
          // filter target types per camera view to feel more dynamic
          if (selectedCam.id === "cam-1" && target.label === "Vehicle") return;
          if (selectedCam.id === "cam-2" && target.label === "Person") return;
          if (selectedCam.id === "cam-3" && target.label === "Drone") return;

          // Move targets
          target.x += target.dx;
          target.y += target.dy;

          // Bound checks
          if (target.x < 50 || target.x > width - 150) target.dx *= -1;
          if (target.y < 50 || target.y > height - 150) target.dy *= -1;

          // Set colors based on camera type
          let drawColor = "var(--primary)";
          if (selectedCam.type === "nightvision") drawColor = "var(--success)";
          if (selectedCam.type === "radar") drawColor = "var(--accent)";
          if (selectedCam.id === "cam-1" && target.label === "Person") drawColor = "var(--danger)"; // High risk person alert

          ctx.strokeStyle = drawColor;
          ctx.lineWidth = 2;
          ctx.setLineDash([]);
          
          // Draw corner brackets instead of complete bounding box (SpaceX look)
          const gap = 15;
          const { x, y, w, h } = target;
          
          // Top Left
          ctx.beginPath(); ctx.moveTo(x + gap, y); ctx.lineTo(x, y); ctx.lineTo(x, y + gap); ctx.stroke();
          // Top Right
          ctx.beginPath(); ctx.moveTo(x + w - gap, y); ctx.lineTo(x + w, y); ctx.lineTo(x + w, y + gap); ctx.stroke();
          // Bottom Left
          ctx.beginPath(); ctx.moveTo(x + gap, y + h); ctx.lineTo(x, y + h); ctx.lineTo(x, y + gap + h); ctx.stroke();
          // Bottom Right
          ctx.beginPath(); ctx.moveTo(x + w - gap, y + h); ctx.lineTo(x + w, y + h); ctx.lineTo(x + w, y + gap + h); ctx.stroke();

          // Draw crosshair inside target center
          ctx.beginPath();
          ctx.arc(x + w/2, y + h/2, 4, 0, Math.PI * 2);
          ctx.fillStyle = drawColor;
          ctx.fill();

          // Label box
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
      
      // Center vertical / horizontal grid line
      ctx.beginPath(); ctx.moveTo(width / 2, 0); ctx.lineTo(width / 2, height); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, height / 2); ctx.lineTo(width, height / 2); ctx.stroke();
      
      // Center circle
      ctx.beginPath();
      ctx.arc(width/2, height/2, 100, 0, Math.PI * 2);
      ctx.stroke();

      // Scanline static noise bar
      const scanY = (frame * 1.5) % height;
      ctx.fillStyle = "rgba(0, 229, 255, 0.06)";
      ctx.fillRect(0, scanY, width, 2);

      // Coordinates Overlay
      ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
      ctx.font = "bold 9px Courier New";
      ctx.setLineDash([]);
      ctx.fillText(`SYS.CCTV_INPUT: ${useWebcam ? "ACTIVE WEBCAM STREAM" : "SIMULATED TACTICAL FEED"}`, 20, height - 55);
      ctx.fillText(`SYS.SECTOR_LOCK: TRUE`, 20, height - 40);
      ctx.fillText(`LAT_LNG: ${selectedCam.coord}`, 20, height - 25);
      ctx.fillText(`TIME: ${new Date().toISOString()}`, 20, height - 10);

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animationRef.current);
  }, [selectedCam, useWebcam]);

  const triggerSnapshot = () => {
    alert(`Snapshot captured for Sector ${selectedCam.name}. Saving metadata to alerts system.`);
  };

  return (
    <div className="glass-pane camera-card">
      <div className="camera-header">
        <div className="camera-meta">
          <span className="camera-title">{selectedCam.name}</span>
          <span className="camera-specs">
            {selectedCam.res} | {selectedCam.fps} FPS | {selectedCam.coord}
          </span>
        </div>
        <div className="camera-controls">
          <select 
            className="camera-select"
            value={selectedCam.id}
            onChange={(e) => setSelectedCam(cameras.find(c => c.id === e.target.value))}
          >
            {cameras.map(cam => (
              <option key={cam.id} value={cam.id}>{cam.name}</option>
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
      <div className={`video-wrapper ${isFullscreen ? "fullscreen" : ""}`}>
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
            <FiMaximize />
          </button>
        </div>
      </div>

      {/* Carousel Selector */}
      <div className="camera-carousel">
        {cameras.map(cam => (
          <div 
            key={cam.id} 
            className={`carousel-item ${selectedCam.id === cam.id ? "active" : ""}`}
            onClick={() => setSelectedCam(cam)}
          >
            {/* Draw a static visual graphic thumbnail */}
            <div className="carousel-thumb-canvas" style={{
              background: cam.type === "thermal" 
                ? "linear-gradient(45deg, #090e1a, rgba(0,229,255,0.15))"
                : cam.type === "nightvision"
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

import cv2
import requests
import base64
import time
import os
from tracker import SurveillanceTracker
from utils import SpeedTracker, is_inside_polygon

def run_engine():
    print("🚀 Initializing SentinelAI Surveillance Engine...")
    
    # Initialize trackers
    tracker = SurveillanceTracker()
    speed_tracker = SpeedTracker(fps=30)
    
    # HTTP server target configurations
    backend_url = "http://localhost:5000/api/detections/event"
    
    # Keep track of last telemetry dispatches to prevent route flooding
    last_dispatch_times = {} # tracking_id -> timestamp
    
    # Restricted Zone Polygon coordinates (Relative to 640x480 frame)
    # Forms a tactical polygon trap in the middle of the screen
    restricted_zone = [(150, 150), (490, 150), (550, 420), (90, 420)]
    
    print("Opening CCTV video capture card (Webcam)...")
    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print("Error: Could not open default system camera.")
        return

    # Set frame dimensions
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
    
    print("SentinelAI CCTV active. HUD polygon rendering. Press [ESC] to exit.")
    
    while True:
        success, frame = cap.read()
        if not success:
            print("Failed to capture feed.")
            break
            
        curr_time = time.time()
        
        # Process frame with YOLOv8 ByteTracker
        results = tracker.process(frame)
        
        # Overlay Restricted Zone Polygon on frame
        # Draw red warning border if breach is detected, otherwise cyan HUD border
        zone_color = (0, 0, 255) # Red alert zone default
        cv2.polylines(frame, [cv2.utils.nested_to_list(restricted_zone)], isClosed=True, color=zone_color, thickness=2)
        
        # Draw HUD label
        cv2.putText(frame, "RESTRICTED BOUNDARY ALPHA", (100, 140), cv2.FONT_HERSHEY_SIMPLEX, 0.5, zone_color, 1)

        # Parse inference tracking records
        if results and results[0].boxes is not None and results[0].boxes.id is not None:
            boxes = results[0].boxes.xyxy.cpu().numpy()
            track_ids = results[0].boxes.id.int().cpu().numpy()
            class_ids = results[0].boxes.cls.int().cpu().numpy()
            confidences = results[0].boxes.conf.cpu().numpy()
            
            for box, track_id, class_id, conf in zip(boxes, track_ids, class_ids, confidences):
                x1, y1, x2, y2 = box
                center_x = int((x1 + x2) / 2)
                center_y = int((y1 + y2) / 2)
                bottom_center = (center_x, int(y2))
                
                # Check for restricted zone breaches
                zone_breached = is_inside_polygon(bottom_center, restricted_zone)
                
                # Estimate speeds and headings
                speed, heading = speed_tracker.update_and_calculate(track_id, center_x, center_y)
                
                class_name = tracker.model.names[class_id]
                
                # Bounding Box indicator color
                box_color = (0, 0, 255) if zone_breached else (255, 229, 0) # red if breach, else cyan
                
                # Draw boxes HUD
                cv2.rectangle(frame, (int(x1), int(y1)), (int(x2), int(y2)), box_color, 2)
                
                # Label details
                label_txt = f"ID:{track_id} {class_name.upper()} ({speed} {heading})"
                cv2.putText(frame, label_txt, (int(x1), int(y1) - 8), cv2.FONT_HERSHEY_SIMPLEX, 0.4, box_color, 1)
                
                # Dispatch alert event if high-risk or zone breached with throttling (every 3 seconds)
                should_alert = zone_breached or class_name.lower() in ["drone", "unknown object"]
                
                if should_alert:
                    last_dispatch = last_dispatch_times.get(track_id, 0)
                    if curr_time - last_dispatch > 3.0: # 3s throttle window
                        last_dispatch_times[track_id] = curr_time
                        
                        # Encode target capture frame to JPEG base64
                        ret, buffer = cv2.imencode('.jpg', frame)
                        base64_image = ""
                        if ret:
                            base64_str = base64.b64encode(buffer).decode('utf-8')
                            base64_image = f"data:image/jpeg;base64,{base64_str}"

                        payload = {
                            "camera": "Sector Alpha-12 (North)",
                            "className": class_name,
                            "confidence": float(conf),
                            "trackingId": int(track_id),
                            "location": "32.784 N, 104.982 W",
                            "speed": speed,
                            "direction": heading,
                            "restrictedZoneBreach": bool(zone_breached),
                            "image": base64_image
                        }

                        # Dispatch HTTP POST event asynchronously
                        try:
                            requests.post(backend_url, json=payload, timeout=2.0)
                            print(f"📡 Dispatch Alert: {class_name} ID:{track_id} | zone breach: {zone_breached}")
                        except Exception as e:
                            print(f"❌ Failed to dispatch alert log: {e}")

        # Render local feed window
        cv2.imshow("SentinelAI AI Tracking Core", frame)
        
        # Exit on ESC
        if cv2.waitKey(1) == 27:
            break
            
    cap.release()
    cv2.destroyAllWindows()
    print("Surveillance engine deactivated.")

if __name__ == "__main__":
    run_engine()

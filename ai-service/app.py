from flask import Flask, jsonify, Response
from flask_cors import CORS
from ultralytics import YOLO
import cv2
from datetime import datetime

app = Flask(__name__)
CORS(app)

print("Loading YOLO...")
model = YOLO("yolov8n.pt")
print("YOLO Loaded!")

# In-memory database of detected targets (Phase 4)
detections_db = []

# Targets class lists (COCO indices: person, bicycle, car, motorcycle, bus, truck, bird, cat, dog)
target_class_ids = [0, 1, 2, 3, 5, 7, 14, 15, 16]


def log_detections(results):
    """Parses YOLO boxes and appends detections with conf >= 50% to the sliding database."""
    if not results or len(results) == 0:
        return

    for box in results[0].boxes:
        cls_id = int(box.cls[0])
        cls_name = model.names[cls_id]
        conf_val = float(box.conf[0])

        detection = {
            "class": cls_name,
            "confidence": round(conf_val, 2),
            "time": datetime.now().isoformat()
        }
        
        detections_db.append(detection)

        # Cap sliding log to prevent memory leaks
        if len(detections_db) > 100:
            detections_db.pop(0)


def gen_frames():
    """Generates JPEG frame streams for the web browser CCTV viewport."""
    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print("Error: Could not open webcam.")
        return

    while True:
        success, frame = cap.read()
        if not success:
            break
        
        # Run YOLO with conf & classes pre-filters
        results = model(frame, conf=0.50, classes=target_class_ids)
        
        # Log detections in memory
        log_detections(results)
        
        # Plot annotations (bounding boxes) on frame
        annotated_frame = results[0].plot()
        
        # Encode as JPG
        ret, buffer = cv2.imencode('.jpg', annotated_frame)
        if not ret:
            continue
            
        frame_bytes = buffer.tobytes()
        
        # Stream chunks
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')
               
    cap.release()


@app.route("/")
def home():
    # Phase 2 REST GET /
    return jsonify({"message": "SentinelAI AI Service Running"})


@app.route("/detect")
def detect():
    # Phase 2 REST GET /detect
    print("Starting local OpenCV surveillance view...")
    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        return jsonify({"error": "Webcam not available"}), 500

    while True:
        success, frame = cap.read()
        if not success:
            break
            
        # Run YOLO
        results = model(frame, conf=0.50, classes=target_class_ids)
        
        # Log in memory
        log_detections(results)
        
        # Draw on screen
        annotated = results[0].plot()
        cv2.imshow("SentinelAI Detection Console", annotated)
        
        if cv2.waitKey(1) == 27:  # Exit on ESC
            break

    cap.release()
    cv2.destroyAllWindows()
    return jsonify({"message": "Detection Finished"})


@app.route("/detections")
def get_detections():
    # Exposes in-memory detections for backend polling proxy
    return jsonify(detections_db)


@app.route("/video_feed")
def video_feed():
    return Response(gen_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')


if __name__ == "__main__":
    app.run(port=8000, debug=True)
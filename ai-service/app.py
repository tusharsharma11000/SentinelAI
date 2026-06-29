from flask import Flask, jsonify
from flask_cors import CORS
from ultralytics import YOLO
import cv2

app = Flask(__name__)
CORS(app)

print("Loading YOLO...")
model = YOLO("yolov8n.pt")
print("YOLO Loaded!")

@app.route("/")
def home():
    return jsonify({"message": "SentinelAI AI Service Running"})


@app.route("/detect")
def detect():

    cap = cv2.VideoCapture(0)

    while True:

        success, frame = cap.read()

        if not success:
            break

        results = model(frame)

        annotated = results[0].plot()

        cv2.imshow("SentinelAI Detection", annotated)

        if cv2.waitKey(1) == 27:
            break

    cap.release()
    cv2.destroyAllWindows()

    return jsonify({"message": "Detection Finished"})


if __name__ == "__main__":
    app.run(port=8000, debug=True)
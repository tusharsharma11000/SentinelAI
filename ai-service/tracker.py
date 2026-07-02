from ultralytics import YOLO

class SurveillanceTracker:
    def __init__(self, model_name="yolov8n.pt"):
        print(f"Initializing tracking core using weights: {model_name}")
        self.model = YOLO(model_name)
        
        # COCO indices for targets: person, bicycle, car, motorcycle, bus, truck, bird, cat, dog
        self.target_class_ids = [0, 1, 2, 3, 5, 7, 14, 15, 16]

    def process(self, frame):
        """Processes frame through YOLOv8 byte-tracker, retaining IDs across frames."""
        results = self.model.track(
            source=frame,
            persist=True,
            conf=0.50,
            classes=self.target_class_ids,
            tracker="bytetrack.yaml",
            show=False
        )
        return results

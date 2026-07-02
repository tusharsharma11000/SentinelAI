import cv2
from ultralytics import YOLO

def run_detection():
    print("Loading YOLOv8 Nano model...")
    # Load YOLOv8 Nano pre-trained weights
    model = YOLO("yolov8n.pt")
    print("YOLO model loaded successfully!")

    print("Initializing system webcam...")
    # Capture default video source
    cap = cv2.VideoCapture(0)
    
    if not cap.isOpened():
        print("Error: Could not access the webcam.")
        return

    print("Surveillance detection feed active. Press [ESC] to terminate.")
    
    # YOLO classes corresponding to: person, car, bus, truck, motorcycle, bicycle, dog, cat, bird
    # COCO Indices: 0: person, 1: bicycle, 2: car, 3: motorcycle, 5: bus, 7: truck, 14: bird, 15: cat, 16: dog
    target_class_ids = [0, 1, 2, 3, 5, 7, 14, 15, 16]
    
    while True:
        success, frame = cap.read()
        if not success:
            print("Error: Failed to capture frames from webcam.")
            break
            
        # Run YOLO inference on the captured webcam frame
        # conf=0.50 ignores detections below 50% confidence
        # classes filters detections to our specified class IDs
        results = model(frame, conf=0.50, classes=target_class_ids)
        
        # Plot target bounding boxes and labels on the frame
        annotated_frame = results[0].plot()
        
        # Display the visual feed locally
        cv2.imshow("SentinelAI Standalone CCTV Feed", annotated_frame)
        
        # Terminate when user presses the ESC key (ASCII code 27)
        if cv2.waitKey(1) == 27:
            break
            
    # Release resources
    cap.release()
    cv2.destroyAllWindows()
    print("System surveillance terminated.")

if __name__ == "__main__":
    run_detection()

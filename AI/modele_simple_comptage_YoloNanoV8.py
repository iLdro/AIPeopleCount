from flask import Flask, render_template, Response
import cv2
import torch
from ultralytics import YOLO

app = Flask(__name__)

model = YOLO('yolov8n.pt')
 
def generate_frames():
    cap = cv2.VideoCapture(r"data/Normal_Videos008_x264.mp4")

    frame_id = 0  # Compteur de frames
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        frame_id += 1
        if frame_id % 2 != 0:  # Skip 1 frame sur 2
            continue

        results = model(frame)

        person_count = 0
        for detection in results[0].boxes:
            if detection.cls == 0:  # 0 représente la classe 'personne'
                person_count += 1
                x1, y1, x2, y2 = map(int, detection.xyxy[0])
                cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)

        cv2.putText(frame, f"Personnes: {person_count}", (10, 30),
                    cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)

        _, buffer = cv2.imencode('.jpg', frame)
        frame = buffer.tobytes()

        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

    cap.release()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == '__main__':
    app.run(debug=True)
from flask import Flask, render_template, Response
import cv2
import torch
from ultralytics import YOLO
import requests

from deep_sort_realtime.deepsort_tracker import DeepSort

app = Flask(__name__)

model = YOLO('yolov8n.pt')

# Initialize DeepSort
tracker = DeepSort(
    max_age=30,
    n_init=6,
    max_iou_distance=0.9,
    max_cosine_distance=0.2,
    nn_budget=100,
    override_track_class=None
)

# Constants for Entry/Exit Zones
ENTER_EXIT_REGION = 0.2  # 20% of the frame width
ROOM_REGION = 0.8  # 20% of the frame width

# Tracking Data
trajectories = {}
entered_count = 0
exited_count = 0

# API Configuration
base_url = "http://localhost:3000/"
addPeople = "building/people/add/"
removePeople = "building/people/remove/"
building = "bat A/"
camera = "camera1"

rslt = requests.post(base_url + "building/list")
print(rslt.content.decode())


def generate_frames():
    global entered_count, exited_count
    cap = cv2.VideoCapture(0)
    frame_width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    frame_height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        results = model(frame)
        detections = []

        # Collect YOLO detections
        for detection in results[0].boxes:
            if detection.cls == 0:  # Person class
                x1, y1, x2, y2 = map(int, detection.xyxy[0])
                conf = float(detection.conf)
                if (x2 - x1) > 10 and (y2 - y1) > 20:  # Ignore small detections
                    detections.append(([x1, y1, x2, y2], conf, 0))

        # Update DeepSort tracker
        tracks = tracker.update_tracks(detections, frame=frame)
        current_ids = set()

        for track in tracks:
            if not track.is_confirmed() or track.time_since_update > 1:
                continue

            track_id = track.track_id
            x1, y1, x2, y2 = map(int, track.to_tlbr())
            x_center = (x1 + x2) // 2  # X-coordinate of the center
            current_ids.add(track_id)

            # Initialize trajectory for new IDs
            if track_id not in trajectories:
                trajectories[track_id] = {
                    "start_x": x_center,
                    "current_x": x_center,
                }
            else:
                # Update current position
                trajectories[track_id]["current_x"] = x_center

                # Determine entry/exit based on movement
                start_x = trajectories[track_id]["start_x"]
                current_x = trajectories[track_id]["current_x"]

                # Entry: From Left to Right
                if start_x < frame_width * ENTER_EXIT_REGION and current_x > frame_width * ENTER_EXIT_REGION:
                    entered_count += 1
                    requests.post(base_url + addPeople + building, json={"cameraId": camera})
                    print(f"ID {track_id} entered from left.")
                    del trajectories[track_id]  # Remove to prevent double counting

                # Exit: From Right to Left
                elif start_x > frame_width * ENTER_EXIT_REGION and current_x < frame_width * ENTER_EXIT_REGION:
                    exited_count += 1
                    requests.post(base_url + removePeople + building, json={"cameraId": camera})
                    print(f"ID {track_id} exited to left.")
                    del trajectories[track_id]  # Remove to prevent double counting

            # Display track ID and bounding box
            cv2.putText(frame, f"ID: {track_id}", (x1, y1 - 10),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.5, (200, 0, 0), 2)

        # Remove stale IDs not present in the current frame
        for track_id in list(trajectories.keys()):
            if track_id not in current_ids:
                del trajectories[track_id]

        # Draw left and right region lines
        cv2.line(frame, (int(frame_width * ENTER_EXIT_REGION), 0), 
                 (int(frame_width * ENTER_EXIT_REGION), frame_height), (0, 255, 0), 2)  # Enter/Exit Region Line

        # Display Entry/Exit counts
        cv2.putText(frame, f"Entries: {entered_count}", (10, 50),
                    cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
        cv2.putText(frame, f"Exits: {exited_count}", (10, 100),
                    cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)

        # Display the number of people in the camera field
        cv2.putText(frame, f"People in View: {len(current_ids)}", (10, 150),
                    cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 0), 2)

        # Encode and send frame to the client
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

from flask import Flask, render_template, Response
import cv2
import torch
from ultralytics import YOLO
import requests

from deep_sort_realtime.deepsort_tracker import DeepSort

app = Flask(__name__)

model = YOLO('yolov8n.pt')
 
# Créer une instance de DeepSort
tracker = DeepSort(
    max_age=30,       # Nombre maximum de frames sans mise à jour avant qu'un objet soit supprimé
    n_init=6,         # Nombre minimum de frames consécutives pour confirmer une détection
    max_iou_distance=0.9,  # Distance maximale IoU pour le matching
    max_cosine_distance=0.2,  # Distance cosinus pour la similarité des caractéristiques
    nn_budget=100,    # Taille maximale de la mémoire du classificateur
    override_track_class=None  # Suivre toutes les classes par défaut
)

trajectories = {}  # Dictionnaire pour stocker les trajectoires des objets

base_url = "http://localhost:3000/"

addPeople = "building/people/add/"
removePeople = "building/people/remove/"

peopleOnCamera = "camera/"

building = "bat A/"

camera = "camera1"

rslt = requests.post(base_url + "building/list")
print(rslt.content.decode())

def generate_frames():
    cap = cv2.VideoCapture(0)
    
    entered_count = 0
    exited_count = 0

    # Dictionnaire pour suivre les états des IDs
    id_states = {}  # ID -> {"state": "visible", "frames_out": int, "frames_in": int, "last_position": (x, y)}
    entry_points = []  # Points d'entrée [(x, y, frames_remaining)]
    exit_points = []  # Points de sortie [(x, y, frames_remaining)]
    entry_threshold = 10  # Frames pour confirmer une entrée
    exit_threshold = 15  # Frames pour confirmer une sortie
    
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        results = model(frame)
        detections = []

        # Collecter les détections YOLO
        for detection in results[0].boxes:
            if detection.cls == 0:  # Classe "personne"
                x1, y1, x2, y2 = map(int, detection.xyxy[0])
                conf = float(detection.conf)
                if (x2 - x1) > 10 and (y2 - y1) > 20:  # Ignorer les détections trop petites
                    detections.append(([x1, y1, x2, y2], conf, 0))

        # Tracker les objets avec DeepSort
        tracks = tracker.update_tracks(detections, frame=frame)
        current_ids = set()
        frame_height, frame_width = frame.shape[:2]

        for track in tracks:
            if not track.is_confirmed() or track.time_since_update > 1:
                continue

            track_id = track.track_id
            x1, y1, x2, y2 = map(int, track.to_tlbr())
            x_center, y_center = (x1 + x2) // 2, (y1 + y2) // 2

            current_ids.add(track_id)

            # Si l'ID n'existait pas, l'ajouter comme potentiel entrant
            if track_id not in id_states:
                id_states[track_id] = {
                    "state": "visible",
                    "frames_out": 0,
                    "frames_in": 0,
                    "last_position": (x_center, y_center)
                }

            # Mettre à jour les informations pour les IDs visibles
            id_states[track_id]["frames_out"] = 0
            id_states[track_id]["frames_in"] += 1
            id_states[track_id]["last_position"] = (x_center, y_center)

            # Confirmer une entrée après le seuil
            if id_states[track_id]["frames_in"] == entry_threshold:
                entered_count += 1
                requests.post(base_url + addPeople + building, json={"cameraId": camera})                
                entry_points.append([x_center, y_center, 30])
                print(f"ID {track_id}: Confirmed entered at ({x_center}, {y_center})")

            # Afficher l'ID
            cv2.putText(frame, f"ID: {track_id}", (x1, y1 - 10),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 0, 0), 2)

        # Gérer les sorties
        for track_id in list(id_states.keys()):
            if track_id not in current_ids:  # Si l'ID n'est plus visible
                id_states[track_id]["frames_out"] += 1

                if id_states[track_id]["frames_out"] > exit_threshold:
                    if id_states[track_id]["state"] == "visible":
                        x_center, y_center = id_states[track_id]["last_position"]

                        # Vérifiez que l'objet est hors du cadre
                        if (x_center <= 10 or x_center >= frame_width - 10 or
                                y_center <= 10 or y_center >= frame_height - 10):
                            id_states[track_id]["state"] = "exited"
                            exited_count += 1
                            print("removePeople")
                            requests.post(base_url + removePeople + building, json={"cameraId": camera})
                            exit_points.append([x_center, y_center, 30])  # Point rouge visible 2 secondes
                            print(f"ID {track_id}: Confirmed exited at ({x_center}, {y_center})")
                    else:  # Supprimer l'ID si absent trop longtemps
                        del id_states[track_id]
                        print(f"ID {track_id}: Removed due to prolonged absence")

        # Dessiner les points d'entrée et de sortie
        for point in entry_points:
            # cv2.circle(frame, (point[0], point[1]), 5, (0, 255, 0), -1)  # Point vert pour les entrées
            point[2] -= 1
        entry_points = [point for point in entry_points if point[2] > 0]

        for point in exit_points:
            # cv2.circle(frame, (point[0], point[1]), 5, (0, 0, 255), -1)  # Point rouge pour les sorties
            point[2] -= 1
        exit_points = [point for point in exit_points if point[2] > 0]

        # Afficher les compteurs
        cv2.putText(frame, f"Personnes visibles: {len(current_ids)}", (10, 30),
                    cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
        cv2.putText(frame, f"Entrées: {entered_count}", (10, 70),
                    cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 255), 2)
        cv2.putText(frame, f"Sorties: {exited_count}", (10, 110),
                    cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)

        # Encoder et envoyer les images
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
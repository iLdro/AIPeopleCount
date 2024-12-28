from flask import Flask, render_template, Response
import cv2
import torch
from ultralytics import YOLO
import matplotlib.pyplot as plt
import numpy as np
from io import BytesIO

app = Flask(__name__)

model = YOLO('yolov8n.pt')

# Variable pour stocker l'historique du comptage des personnes
person_counts = []

def generate_frames():
    cap = cv2.VideoCapture(r"C:\Valentin\M2 2024-2025\Innovation project\gens qui marchent.vid.mp4")

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        # Détection des personnes avec YOLOv8
        results = model(frame)

        # Compter le nombre de personnes dans l'image actuelle
        person_count = 0
        for detection in results[0].boxes:
            if detection.cls == 0:  # Classe 'person'
                person_count += 1
                x1, y1, x2, y2 = map(int, detection.xyxy[0])
                cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)

        # Ajouter le nombre de personnes actuel à l'historique
        person_counts.append(person_count)

        # Limiter l'historique pour garder les données récentes (dernier 50 counts)
        if len(person_counts) > 50:
            person_counts.pop(0)

        # Afficher le comptage sur le flux vidéo
        cv2.putText(frame, f"Personnes dans le cadre: {person_count}", (10, 30),
                    cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)

        # Générer le graphique de suivi du comptage
        fig, ax = plt.subplots()
        ax.plot(person_counts, color="blue")
        ax.set_title("Suivi du nombre de personnes")
        ax.set_xlabel("Temps (frames)")
        ax.set_ylabel("Nombre de personnes")
        ax.set_ylim(0, max(10, max(person_counts) + 1))  # Ajuster l'échelle Y

        # Convertir le graphique matplotlib en image OpenCV
        buf = BytesIO()
        fig.savefig(buf, format="png")
        buf.seek(0)
        chart_image = np.frombuffer(buf.getvalue(), dtype=np.uint8)
        chart_image = cv2.imdecode(chart_image, cv2.IMREAD_COLOR)

        # Redimensionner le graphique pour l'afficher dans le coin supérieur droit
        chart_image = cv2.resize(chart_image, (frame.shape[1] // 3, frame.shape[0] // 3))
        buf.close()

        # Afficher le graphique dans le coin supérieur droit de la vidéo
        frame[10:10 + chart_image.shape[0], -10 - chart_image.shape[1]:-10] = chart_image

        # Encodage de l'image pour le flux vidéo
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
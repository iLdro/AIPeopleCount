from flask import Flask, render_template, Response
import cv2
import torch
from ultralytics import YOLO
import numpy as np
import matplotlib.pyplot as plt
from matplotlib.backends.backend_agg import FigureCanvasAgg as FigureCanvas
import io

app = Flask(__name__)

# Chargement du modèle YOLOv8
model = YOLO('yolov8n.pt')

# Initialisation de la capture vidéo
cap = cv2.VideoCapture(r"C:\Valentin\M2 2024-2025\Innovation project\Ce père est rentré de larmée pour faire une surprise a ces filles.mp4")

# Variables pour stocker les données du graphique
person_count_data = []
frame_counter = 0

def detect_fight_and_people():
    global frame_counter
    fight_detected = False

    ret, frame1 = cap.read()
    prvs = cv2.cvtColor(frame1, cv2.COLOR_BGR2GRAY)

    while cap.isOpened():
        ret, frame2 = cap.read()
        if not ret:
            break
        
        # Détection des personnes avec YOLOv8
        results = model(frame2)
        person_count = sum(1 for detection in results[0].boxes if detection.cls == 0)
        
        # Mettre à jour les données pour le graphique
        person_count_data.append(person_count)
        frame_counter += 1

        # Calcul du flux optique pour détecter une activité intense
        next_frame = cv2.cvtColor(frame2, cv2.COLOR_BGR2GRAY)
        flow = cv2.calcOpticalFlowFarneback(prvs, next_frame, None, 0.5, 3, 15, 3, 5, 1.2, 0)
        mag, ang = cv2.cartToPolar(flow[..., 0], flow[..., 1])
        
        # Seuil pour détecter une bagarre (ajustez le seuil selon la vidéo)
        threshold = 3.5
        movement_intensity = np.mean(mag)
        fight_detected = movement_intensity > threshold
        
        # Annoter le frame
        cv2.putText(frame2, f"Personnes: {person_count}", (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
        cv2.putText(frame2, f"Bagarre: {'Oui' if fight_detected else 'Non'}", (10, 70), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255) if fight_detected else (0, 255, 0), 2)
        
        prvs = next_frame

        # Encodage pour affichage
        _, buffer = cv2.imencode('.jpg', frame2)
        frame = buffer.tobytes()

        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

    cap.release()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/video_feed')
def video_feed():
    return Response(detect_fight_and_people(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/person_count_chart')
def person_count_chart():
    # Création du graphique avec matplotlib
    fig, ax = plt.subplots()
    ax.plot(person_count_data, color='blue')
    ax.set_title("Nombre de personnes dans le cadre")
    ax.set_xlabel("Frame")
    ax.set_ylabel("Nombre de personnes")
    canvas = FigureCanvas(fig)
    img = io.BytesIO()
    canvas.print_png(img)
    plt.close(fig)
    img.seek(0)
    return Response(img.getvalue(), mimetype='image/png')

if __name__ == '__main__':
    app.run(debug=True)
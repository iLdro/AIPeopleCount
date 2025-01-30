import cv2

# Essaye différents index : 0, 1, 2...
for i in range(5):
    print(i)
    cap = cv2.VideoCapture(i)
    if cap.isOpened():
        print(f"✅ Caméra détectée à l'index {i}")
        cap.release()
    else:
        print(f"❌ Pas de caméra à l'index {i}")

import cv2

videoWebcam = cv2.VideoCapture(0)

while True:
    valeurRetour, imageWebcam = videoWebcam.read()
    cv2.imshow('Image de la webcam', imageWebcam)
    if cv2.waitKey(1) & 0xFF == ord('q'):
            break
videoWebcam.release()
cv2.destroyAllWindows()
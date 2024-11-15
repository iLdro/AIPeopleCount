import unittest
from unittest.mock import patch, MagicMock
import cv2

class TestWebcamCapture(unittest.TestCase):
    @patch('cv2.VideoCapture')
    @patch('cv2.imshow')
    @patch('cv2.waitKey', side_effect=[-1, -1, ord('q')])  # Simule l'appui de la touche 'q'
    def test_webcam_capture(self, mock_waitKey, mock_imshow, mock_VideoCapture):
        # Crée un objet mock pour VideoCapture
        mock_capture = MagicMock()
        mock_capture.read.side_effect = [(True, 'fake_image'), (True, 'fake_image'), (True, 'fake_image')]  # Simule la lecture d'images
        mock_VideoCapture.return_value = mock_capture

        # Le code à tester (modifié pour l'adapter à la fonction)
        videoWebcam = cv2.VideoCapture(0)
        while True:
            valeurRetour, imageWebcam = videoWebcam.read()
            if not valeurRetour:
                break
            cv2.imshow('Image de la webcam', imageWebcam)
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break
        videoWebcam.release()
        cv2.destroyAllWindows()

        # Vérifie que VideoCapture a été appelé
        mock_VideoCapture.assert_called_once_with(0)
        # Vérifie que read a été appelé au moins une fois
        self.assertTrue(mock_capture.read.called)
        # Vérifie que imshow a été appelé avec le nom de fenêtre correct
        mock_imshow.assert_called_with('Image de la webcam', 'fake_image')
        # Vérifie que waitKey a été appelé
        self.assertTrue(mock_waitKey.called)

if __name__ == '__main__':
    unittest.main()

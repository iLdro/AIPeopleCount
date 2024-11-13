FROM python:3.9-slim

# Update apt-get and install dependencies
RUN apt-get update && \
    apt-get install -y libgl1-mesa-glx libsm6 libxext6 libxrender-dev && \
    pip install opencv-python-headless

# Copy the application and test files
COPY Dev/Camera/cameraFlux.py /app/cameraFlux.py

COPY Dev/Camera/Test/cameraTest.py /app/Test/cameraTest.py

WORKDIR /app

# Run the tests when the container starts
CMD ["python", "-m", "unittest", "Test/cameraTest.py"]

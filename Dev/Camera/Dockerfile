FROM python:3.9-slim


RUN apt-get update && \
    apt-get install -y libgl1-mesa-glx libsm6 libxext6 libxrender-dev && \
    pip install opencv-python-headless

WORKDIR /app

# Update apt-get and install dependencies

# Copy the application and test files
COPY cameraFlux.py .

COPY /Test/cameraTest.py .

WORKDIR /Test

# Run the tests when the container starts
CMD ["python", "-m", "unittest", "Test/cameraTest.py"]

FROM python:3.9-slim

# Update and install necessary dependencies
RUN apt-get update && \
    apt-get install -y libgl1-mesa-glx libsm6 libxext6 libxrender-dev && \
    pip install opencv-python-headless

# Set the working directory inside the container
WORKDIR /app

# Copy application and test files
COPY cameraFlux.py /app/
COPY Test/cameraTest.py /app/Test/

# Set the default command to run tests
CMD ["python", "-m", "unittest", "discover", "-s", "/app/Test"]

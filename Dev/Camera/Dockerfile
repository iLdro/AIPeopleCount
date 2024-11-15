FROM python:3.9-slim

# Install necessary dependencies
RUN apt-get update && \
    apt-get install -y libgl1-mesa-glx libsm6 libxext6 libxrender-dev && \
    pip install opencv-python-headless

# Set the working directory inside the container
WORKDIR /app

# Copy application and test files relative to the build context
COPY . . /app

# Set the default command to run tests
CMD ["python", "-m", "unittest", "discover", "-s", "Test", "-p", "*.py"]

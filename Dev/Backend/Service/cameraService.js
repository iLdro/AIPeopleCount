const { Camera } = require('../Schema/camera');

function CameraUpdate(cameraId, people) {
    let camera = Camera.add({ cameraId: cameraId }, { actualOnCamera: people }, { lastUpdated: new Date() });
    return camera;
}

module.exports = { CameraUpdate };
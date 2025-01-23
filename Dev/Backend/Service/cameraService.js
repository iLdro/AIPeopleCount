const { Camera } = require('../Schema/camera');

async function CameraUpdate(cameraId, people) {
    let camera = new Camera({ cameraId: cameraId, actualOnCamera: people, lastUpdated: new Date() });
    return await camera.save();
}

async function getCameraPeople(cameraId) {
    let camera = await Camera.findOne({ cameraId: cameraId });
    return camera ? camera.actualOnCamera : null;
}

module.exports = { CameraUpdate, getCameraPeople };
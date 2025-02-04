const { Camera } = require('../Schema/camera');

async function CameraUpdate(cameraId, people) {
    console.log('CameraUpdate', cameraId, people);
    let camera = new Camera({ cameraId: cameraId, actualOnCamera: people, lastUpdated: new Date() });
    return await camera.save();
}

async function getCameraPeople(cameraId) {
    let camera = await Camera.findOne({ cameraId: cameraId }, { _id: 0, __v: 0 }).sort({ lastUpdated: -1 });
    console.log('getCameraPeople', camera); // This line is not needed
    return camera ? camera.actualOnCamera : null;
}

module.exports = { CameraUpdate, getCameraPeople };
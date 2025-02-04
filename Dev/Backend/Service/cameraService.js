const { Camera } = require('../Schema/camera');

async function CameraUpdate(cameraId, people) {
    console.log('CameraUpdate', cameraId, people);
    let camera = new Camera({ cameraId: cameraId, actualOnCamera: people, lastUpdated: new Date() });
    return await camera.save();
}

async function getCameraPeople(cameraId) {
    const camera = await Camera.findOne(
        { cameraId: cameraId },
        { _id: 0, __v: 0 }
    ).sort({ lastUpdated: -1 });

    if (!camera) {
        return { actual: 0 }; // Retourne 0 si aucune donnée trouvée
    }

    return  camera.actualOnCamera ;
}


module.exports = { CameraUpdate, getCameraPeople };
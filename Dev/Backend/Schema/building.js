const mongoose = require('mongoose');

const buildingSchema = new mongoose.Schema({
    buildingId: { type: String, required: true,},
    counter: { type: Number, required: true },
    cameraId: { type: String, required: true },
    lastUpdated: { type: Date, required: true },
});

const Building = mongoose.model('Building', buildingSchema);
module.exports = { Building };
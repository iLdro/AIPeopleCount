const mongoose = require('mongoose');

const buildingSchema = new mongoose.Schema({
    buildingId: { type: String, required: true, index: true },
    lastUpdated: { type: Date, required: true },
    counter: { type: Number, required: true },
    cameraId: { type: String, required: true }
});

// Compound index on buildingId and lastUpdated for optimized query performance
buildingSchema.index({ buildingId: 1, lastUpdated: -1 });

const Building = mongoose.model('Building', buildingSchema);

module.exports = {Building};

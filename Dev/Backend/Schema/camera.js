const mongoose = require('mongoose');

const cameraSchema = new mongoose.Schema({
    cameraId: {
        type: String,
        required: true,
    },
    actualOnCamera: {
        type: Number,
        required: true,
    },
    lastUpdated: {
        type: Date,
        required: true,
    },
});

const Camera = mongoose.model('Camera', cameraSchema);
module.exports = {Camera};
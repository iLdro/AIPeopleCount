const mongoose = require('mongoose');

const cameraSchema = new mongoose.Schema({
    cameragId: {
        type: String,
        required: true,
    },
    actualOnCamera: {
        type: Number,
        required: true,
    }
});

const Camera = mongoose.model('Camera', cameraSchema);
module.exports = Camera;
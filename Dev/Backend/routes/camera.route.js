const express = require('express');
const myController = express.Router();

const cameraService = require('../Service/cameraService');

myController.get('/hello', (req, res) => {
    res.send({ express: 'Hello From Express' });
});

myController.post('/:id', (req, res) => {
    res.send(cameraService.CameraUpdate(req.params.id, req.body.people));
});

myController.get('/:id/peoples', async (req, res) => {
    try {
        const data = await cameraService.getCameraPeople(req.params.id);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = myController;
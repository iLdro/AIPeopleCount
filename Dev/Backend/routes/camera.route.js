const express = require('express');
const myController = express.Router();

const cameraService = require('../Service/cameraService');

myController.get('/hello', (req, res) => {
    res.send({ express: 'Hello From Express' });
});

myController.post('/:id', (req, res) => {
    res.send(cameraService.CameraUpdate(req.params.id, req.body.people));
});

myController.get('/:id/peoples', (req, res) => {
    console.log('get camera people');
    cameraService.getCameraPeople(req.params.id);

});


module.exports = myController;
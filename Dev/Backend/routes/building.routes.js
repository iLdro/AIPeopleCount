const cameraServices = require('../Service/cameraService');
const express = require('express');
const myController = express.Router();

const buildingService = require('../Service/buildingService');

myController.get('/hello', (req, res) => {
    res.send({ express: 'Hello From Express' });
});

myController.get(':id/people', (req, res) => {
    res.send(buildingService.getPeopleInBasement(req.params.id));
});

myController.post('/people/add/:id', (req, res) => {
    res.send(buildingService.AddingPeopleInBasement(req.body.cameraId, req.params.id)); //need to add the parameter
});

myController.post('/people/remove/:id', (req, res) => {
    res.send(buildingService.AddingPeopleInBasement(req.body.cameraId, req.params.id)); //need to add the parameter
});

myController.get('/'), (req, res) => {
    res.send(buildingService.getDistinctBuilding());
}


module.exports = myController;
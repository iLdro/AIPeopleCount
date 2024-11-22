const buildServices = require('../Service/buildingService');
const cameraServices = require('../Service/cameraService');
const express = require('express');
const myController = express.Router();

const buildingController = require('../Service/buildingService');

myController.get('/hello', (req, res) => {
    res.send({ express: 'Hello From Express' });
});

myController.get('/people/:id', (req, res) => {
    buildingController.getPeopleInBasement(req.params.buildingId);
});

myController.post('/addPeople', (req, res) => {
    buildingController.AddingPeopleInBasement(req.body.cameraId, req.body.buildingId); //need to add the parameter
});

myController.post('/removePeople', (req, res) => {
    buildingController.AddingPeopleInBasement(req.body.cameraId, req.body.buildingId); //need to add the parameter
});

myController.post('/addBuilding', (req, res) => {
    const { buildingId, cameraId } = req.body;
    buildingController.AddBuilding(buildingId, cameraId); //need to add the parameter
}
);

module.exports = myController;
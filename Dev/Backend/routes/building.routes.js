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

myController.post('/addBuilding', async (req, res) => {
    const { buildingId, cameraId } = req.body; // Assuming you're sending `buildingId` and `cameraId` in the request body
    try {
        const building = await buildingController.AddBuilding(buildingId, cameraId); // Await the result
        res.status(201).json(building); // Send the created building as a JSON response
    } catch (error) {
        console.error('Error while adding building:', error.message);
        res.status(500).json({ error: error.message }); // Send error details in the response
    }
});

module.exports = myController;
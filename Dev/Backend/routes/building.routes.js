const cameraServices = require('../Service/cameraService');
const express = require('express');
const myController = express.Router();

const buildingService = require('../Service/buildingService');

myController.get('/hello', (req, res) => {
    res.send({ express: 'Hello From Express' });
});

myController.get('/:id/people', async (req, res) => {
    try {
        const peoples = await buildingService.getPeopleInBasement(req.params.id);
        console.log("People in basement:", peoples);
        res.send({ count: peoples });
    } catch (error) {
        console.error('Error getting people count:', error);
        res.status(500).send({ error: 'Failed to get people count' });
    }
});

myController.post('/people/add/:id', (req, res) => {
    res.send(buildingService.AddingPeopleInBasement(req.body.cameraId, req.params.id)); //need to add the parameter
});

myController.post('/people/remove/:id', (req, res) => {
    res.send(buildingService.AddingPeopleInBasement(req.body.cameraId, req.params.id)); //need to add the parameter
});

myController.get('/list', async (req, res) => {
    try {
        const buildings = await buildingService.getDistinctBuilding();
        res.status(200).send(buildings); // Send the retrieved buildings to the client
    } catch (error) {
        console.error('Error fetching distinct buildings:', error);
        res.status(500).send({ error: 'Failed to fetch distinct buildings' });
    }
});

myController.post('/update-building-ids', async (req, res) => {
    try {
        const result = await buildingService.updateBuildingIds();
        res.status(200).json({
            message: 'Building IDs updated successfully',
            result: result
        });
    } catch (error) {
        console.error('Error in update-building-ids route:', error);
        res.status(500).json({ error: 'Failed to update building IDs' });
    }
});

module.exports = myController;
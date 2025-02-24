const { Building } = require('../Schema/building.js');

async function getPeopleInBasement(buildingId) {
    let people = 0;
    let building = await Building.findOne({ buildingId }).sort({ lastUpdated: -1 }).exec();
    if (building) {
        people = building.counter;
    }
    return people;
}

async function getAllLogsForBasement(building) {
    let logs = await Building.find({ buildingId: building })
    if (logs) {
        return logs;
    }
    else[]
}

async function AddingPeopleInBasement(cameraId, buildingId) {
    console.log("Add for building id:", buildingId);
    let building = await Building.findOne({ buildingId }).sort({ lastUpdated: -1 }).exec();

    if (!building) {
        people = 0; // Set people count to 0 if it's a new basement
    } else {
        people = building.counter + 1;
    }

    let date = new Date();

    let newBuilding = new Building({
        buildingId,
        counter: people,
        cameraId: cameraId,
        lastUpdated: date
    });


    return await newBuilding.save().catch(error => console.error('Error updating the building:', error));
}


async function RemovingPeopleInBasement(cameraId, buildingId) {
    console.log("Remove for building id:", buildingId);
    let people = 0;
    let building = await Building.findOne({ buildingId }).sort({ lastUpdated: -1 }).exec();
    if (!building || building.counter <= 0) {
        people = 0; // Set people count to 0 if it's a new basement
    } else if (building.counter > 0) {
        people = building.counter - 1;
    }

    let date = new Date();

    let newBuilding = new Building({
        buildingId,
        counter: people,
        cameraId: cameraId,
        lastUpdated: date
    });


    await newBuilding.save().catch(error => console.error('Error updating the building:', error));

    return people;
}

async function getDistinctBuilding() {
    try {
        let buildings = await Building.find()
            .distinct('buildingId')
            .exec();

        console.log('Distinct buildings:', buildings);
        return buildings; // Return the result to the caller
    } catch (error) {
        console.error('Error getting the distinct building:', error);
        return []; // Return an empty array in case of an error
    }
}

async function updateBuildingIds() {
    try {
        const result = await Building.updateMany(
            { buildingId: "bat A" },
            { $set: { buildingId: "batA" } }
        );

        // If you need to update multiple patterns, you can chain them
        const result2 = await Building.updateMany(
            { buildingId: "bat B" },
            { $set: { buildingId: "batB" } }
        );

        return {
            firstUpdate: result,
            secondUpdate: result2
        };
    } catch (error) {
        console.error('Error updating building IDs:', error);
        throw error;
    }
}


async function getDistincCameraInBuilding(buildingId) {
    console.log('retrived building id:', buildingId);
    try {
        let cameras = await Building.find({ buildingId: buildingId })
            .distinct('cameraId')
            .exec();
        console.log('Distinct cameras:', cameras);
        return cameras; // Return the result to the caller
    }
    catch (error) {
        console.error('Error getting the distinct camera:', error);
        return []; // Return an empty array in case of an error
    }
}

module.exports = {
    AddingPeopleInBasement,
    RemovingPeopleInBasement,
    getPeopleInBasement,
    getDistinctBuilding,
    updateBuildingIds,
    getAllLogsForBasement,
    getDistincCameraInBuilding
};
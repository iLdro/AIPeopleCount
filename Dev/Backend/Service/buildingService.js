const { Building } = require('../Schema/building.js');

function getPeopleInBasement(buildingId) {
    let people = 0;
    let building = Building.findOne({ buildingId: buildingId });
    if (building) {
        people = building.counter;
    }
    return people;
}

async function AddingPeopleInBasement(cameraId, buildingId) {
    let people = 0;
    let building = await Building.findOne({ buildingId }).lean().exec();

    if (!building) {
        building = new Building({ buildingId, counter: 0 });
        await building.save();
        people = 0; // Set people count to 0 if it's a new basement
    } else {
        people = building.counter - 1;
    }

    await Building.updateOne(
        { buildingId },
        { counter: people, cameraId, lastUpdated: new Date() }
    ).catch(error => console.error('Error updating the building:', error));

    return people;
}

async function AddBuilding(buildingId, cameraId) {
    try {
        let building;
        let people = 0;
        let date = new Date();

        building = new Building({
            buildingId: buildingId,
            counter: people,
            cameraId: cameraId,
            lastUpdated: date,
        });

        console.log("Building: ", building);
        await building.save(); // Save the document
        console.log("Building saved successfully!");
        return building;
    } catch (error) {
        console.error('Error during building save:', error.message);
        throw error;
    }
}


function RemovingPeopleInBasement(cameraId, buildingId) {
    let people = 0;
    let building = Building.findOne({ buildingId: buildingId });
    if (building) {
        people = 0;
    }
    people--;
    Building.updateOne({ buildingId: buildingId }, { counter: people }, { cameraId: cameraId }, { lastUpdated: new Date() });
    return people;
}


module.exports = { AddingPeopleInBasement, AddBuilding, RemovingPeopleInBasement, getPeopleInBasement };
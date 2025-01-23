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

    console.log("Add for building id:", buildingId);
    if (!building) {
        people = 0; // Set people count to 0 if it's a new basement
    } else {
        people = building.counter + 1;
    }

    let date = new Date();

    let newBuilding = new Building({
        buildingId,
        counter: people,
        cameraId : cameraId,
        lastUpdated: date
    });

    await newBuilding.save().catch(error => console.error('Error updating the building:', error));
    return people;
}


async function RemovingPeopleInBasement(cameraId, buildingId) {
    console.log("Remove for building id:", buildingId);
    let people = 0;
    let building = Building.findOne({ buildingId: buildingId });
    if (!building || building.counter <=0 ) {
        people = 0; // Set people count to 0 if it's a new basement
    } else if (building.counter > 0) {
        people = building.counter - 1;
    }

    let date = new Date();

    let newBuilding = new Building({
        buildingId,
        counter: people,
        cameraId : cameraId,
        lastUpdated: date
    });


    await newBuilding.save().catch(error => console.error('Error updating the building:', error));

    console.log('People in basement:', people);
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



module.exports = { AddingPeopleInBasement , RemovingPeopleInBasement, getPeopleInBasement, getDistinctBuilding };
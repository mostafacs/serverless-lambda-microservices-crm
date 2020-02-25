'use strict';

const Vehicle = require('../models/vehicle');


module.exports.saveVehicle = async vehicleParams => {

    let response = {
        isBase64Encoded: false,
        statusCode: 200,
        body: null
    };

    try {
        let vehicle = new Vehicle(vehicleParams);
        vehicle = await vehicle.save();
        response.body = JSON.stringify({ message: 'saved', data: vehicle});
        return response;
    } catch (e) {
        response.statusCode = 500;
        console.log(e);
        return response;
    }

};


module.exports.getVehicle = async data => {

    let response = {
        statusCode: 200,
        body: null
    };

    const email = data.pathParameters.email;
    const vehicle = await Vehicle.findOne({email: email});
    response.body = JSON.stringify({ message: 'Vehicle loaded successfully', data: vehicle});
    return response;
};

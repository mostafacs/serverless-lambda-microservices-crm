'use strict';

const Client = require('../models/client');


module.exports.saveClient = async clientParams => {

    let response = {
        isBase64Encoded: false,
        statusCode: 200,
        body: null
    };

    try {
        let client = new Client(clientParams);
        client = await client.save();
        response.body = JSON.stringify({ message: 'saved', data: client});
        return response;
    } catch (e) {
        response.statusCode = 500;
        console.log(e);
        return response;
    }

};


module.exports.getClient = async data => {

    let response = {
        statusCode: 200,
        body: null
    };

    const email = data.pathParameters.email;
    const client = await Client.findOne({email: email});
    response.body = JSON.stringify({ message: 'Client loaded successfully', data: client});
    return response;
};

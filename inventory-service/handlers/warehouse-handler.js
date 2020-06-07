'use strict';

const Warehouse = require('../models/warehouse');
const props = require('../utils/props');
const requests = require('../utils/request');
require('../db/db');


module.exports.newWarehouse = async params => {

    params = JSON.parse(params.body);
    let response = requests.buildResponse();
    try {
        let warehouse = new Warehouse(params);
        warehouse.totalQty = 0;
        warehouse = await warehouse.save();
        requests.successHandler(warehouse, 'warehouse created successfully', response);
        return response;
    } catch (e) {
        requests.errorHandler(e, response);
        return response;
    }
};

// no warehouse code update
// no locations delete or code update
// location delete should be another endpoint
module.exports.updateWarehouse = async params => {
    params = JSON.parse(params.body);
    let response = requests.buildResponse();
    try {
        const existingWhCode = params.warehouseCode;
        if(!existingWhCode) {
            throw new Error('Warehouse code is empty');
        }
        let existingWh = await Warehouse.findOne({warehouseCode: existingWhCode});
        props.copyProps(params, existingWh, ['_id', 'warehouseCode', 'locations', 'totalQty']);

        // update locations
        // no delete location in this endpoint.
        if ('locations' in params) {
            if(existingWh.locations.length > 0) {

                const newLocationObject = {};
                params.locations.forEach(loc => newLocationObject[loc.locationCode] = loc);
                existingWh.locations.forEach(existLoc => {
                    if(existLoc.locationCode in newLocationObject) {
                        props.copyProps(newLocationObject[existLoc.locationCode], existLoc, ['_id', 'locationCode', 'totalQty']);
                        delete newLocationObject[existLoc.locationCode];
                    }
                });

                Object.keys(newLocationObject).forEach(k => {
                   existingWh.locations.push(newLocationObject[k]);
                });

            } else {
                existingWh.locations = params.locations;
            }
        }

        existingWh = await existingWh.save();
        requests.successHandler(existingWh, 'Warehouse updated successfully', response);
        return response;
    } catch (e) {
        requests.errorHandler(e, response);
        return response;
    }
};




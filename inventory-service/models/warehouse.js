const mongoose = require('mongoose');


module.exports = mongoose.model('Warehouse', {
    warehouseCode: {type: String, index: true, unique: true, required: true},
    warehouseLabel: {type: String, required: true},
    totalQty: {type: Number, index: true, required: true},
    priority: {type: Number, index: true},
    address: {

    },
    locations: [{
        locationLabel: {type: String},
        locationCode: {type: String, index: true, unique: true, required: true},
        locationDesc: {type: String},
        totalQty: {type: Number, required: true},
        priority: {type: Number, required: true}
    }]
});

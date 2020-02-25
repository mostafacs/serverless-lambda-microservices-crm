const mongoose = require('mongoose');


module.exports = mongoose.model('Client', {
    first_name: { type: String},
    last_name: {type: String},
    email: {type: String, index: true},
    address: [{
        street: {type: String},
        city : {type: String},
        state: {type: String},
        zip: {type: String}
    }],
    total_orders: {type: Number}
});
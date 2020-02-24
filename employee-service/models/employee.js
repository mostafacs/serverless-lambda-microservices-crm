const mongoose = require('mongoose')

module.exports = mongoose.model('Employee', {
    first_name: { type: String},
    last_name: {type: String},
    email: {type: String, index: true},
    salary: {type: Number, index: true},
    address: [{
        street: {type: String},
        city : {type: String},
        state: {type: String},
        zip: {type: String}
    }]
});
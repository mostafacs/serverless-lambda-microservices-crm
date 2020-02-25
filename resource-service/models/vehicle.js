const mongoose = require('mongoose');

module.exports = mongoose.model('Vehicle', {
    plate_number: { type: String, index: true},
    model_year: {type: Number},
    manufacturer: {type: String},
    license_number: {type: String},
    license_renew_date: {type: String, index: true},
    motor_number: {type: Number},
    gas_consumption: {type: Number},
    driver: new Schema({
        employee_id:  { type: Number, index: true},
        first_name: { type: String},
        last_name: {type: String},
        email: {type: String}
    })
});
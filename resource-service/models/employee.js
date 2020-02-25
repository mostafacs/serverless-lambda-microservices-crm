const mongoose = require('mongoose');
const JobType = require('../constants/job-type').JobType;

module.exports = mongoose.model('Employee', {
    employee_id: {type: Number, index: true, unique: true, required: true},
    first_name: { type: String},
    last_name: {type: String, required: true},
    email: {type: String, index: true, required: true},
    salary: {type: Number, index: true, required: true},
    job_type: {type: Number, index: true, enum: [JobType.DRIVER, JobType.SALES], required: true},
    address: [{
        street: {type: String},
        city : {type: String},
        state: {type: String},
        zip: {type: String}
    }]
});
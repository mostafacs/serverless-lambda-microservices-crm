const mongoose = require('mongoose');


module.exports = mongoose.model('Invoice', {
    invoice_id: {type: Number, index: true, unique: true, required: true},
    total_amount: {type: Number, index: true, required: true},
    total_quantity: {type: Number, index: true, required: true},
    job_type: {type: Number, index: true, enum: [JobType.DRIVER, JobType.SALES], required: true},
    client: {
        card_id: {type: Number, index: true},
        first_name: { type: String},
        last_name: {type: String},
        email: {type: String, index: true}
    },
    products: [{
        sku: {type: String, index: true},
        title : {type: String},
        amount: {type: String},
        cost_price: {type: Number},
        sale_price: {type: Number}
    }]
});
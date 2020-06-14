const mongoose = require('mongoose');


module.exports = mongoose.model('Invoice', {
    invoiceId: {type: Number, index: true, unique: true, required: true},
    totalPrice: {type: Number, required: true},
    totalQuantity: {type: Number, required: true},
    paid: {type: Number, required: true},
    remain: {type: Number},
    // jobType: {type: Number, enum: [JobType.DRIVER, JobType.SALES]},
    client: {
        firstName: { type: String},
        lastName: {type: String},
        email: {type: String, index: true}
    },
    items: [{
        sku: {type: String, index: true},
        title : {type: String},
        amount: {type: String},
        costPrice: {type: Number},
        salePrice: {type: Number},
        stockLocations: [{locationCode: {type: String}, quantity: {type: number}}] // stock locations codes.
    }]
});
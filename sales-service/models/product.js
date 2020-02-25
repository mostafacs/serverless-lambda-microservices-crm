const mongoose = require('mongoose');

module.exports = mongoose.model('Product', {
    sku: {type: Number, index: true, unique: true, required: true},
    title: { type: String, required: true},
    description: {type: String},
    available_qty: {type: Number, index: true, required: true},
    tags: [{type: String}],
    custom_fields: [{name: {type: String}, value: {type: String}}],
    weight: {type: Number},
    width: {type: Number},
    height: {type: Number},
    cost_price: {type: Number},
    sale_price: {type: Number}
});
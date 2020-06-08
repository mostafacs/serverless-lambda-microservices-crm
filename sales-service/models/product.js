const mongoose = require('mongoose');

module.exports = mongoose.model('Product', {
    sku: {type: Number, index: true, unique: true, required: true},
    title: { type: String, required: true},
    description: {type: String},
    availableQty: {type: Number, index: true, required: true},
    tags: [{type: String}],
    customFields: [{name: {type: String}, value: {type: String}}],
    weight: {type: Number},
    width: {type: Number},
    height: {type: Number},
    costPrice: {type: Number},
    salePrice: {type: Number}
});
const mongoose = require('mongoose');


// location can have multiple products.
// It's a bad idea to index all fields but i'm really used all fields in filter or sorting.
module.exports = mongoose.model('Stock', {
    locationCode: {type: String, unique: true, index: true, required: true},
    warehouseCode: {type: String, index: true, required: true},
    productSku: {type: String, index: true, required: true},
    warehousePriority: {type: Number, index: true},
    locationPriority: {type: Number, index: true},
    quantity: {type: Number, required: true, index: true}

});

const requests = require('../utils/request');
const props = require('../utils/props');
const Invoice = require('../models/invoice');
require('../db/db');



// module.exports.newProduct = async params => {
//
//   params = JSON.parse(params.body);
//   let response = requests.buildResponse();
//   try {
//     let product = new Invoice(params);
//     product.pr = 0;
//     product = await product.save();
//     requests.successHandler(product, 'Product created successfully', response);
//     return response;
//   } catch (e) {
//     requests.errorHandler(e, response);
//     return response;
//   }
// };
//
// module.exports.updateProduct = async params => {
//
//   params = JSON.parse(params.body);
//   let response = requests.buildResponse();
//   try {
//
//     let product = await Product.findOne({sku: details.sku});
//     if(!product) {
//       throw new Error("Product with SKU: [" + details.sku + "] not found.");
//     }
//
//     props.copyProps(params, product, ['_id', 'sku', 'availableQty']);
//
//     product = await product.save();
//     requests.successHandler(product, 'Product updated successfully', response);
//     return response;
//   } catch (e) {
//     requests.errorHandler(e, response);
//     return response;
//   }
// };
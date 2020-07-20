const requests = require('../utils/request');
const props = require('../utils/props');
const Invoice = require('../models/invoice');
const Product = require('../models/product');
const inventoryRemoteCaller = require('../remote-call/inventory-rc');
require('../db/db');


module.exports.newInvoice = async params => {

    params = JSON.parse(params.body);
    let response = requests.buildResponse();
    try {
        let invoice = new Invoice(params);
        invoice.totalPrice = 0;
        invoice.totalQuantity = 0;


        const updatedItems = await inventoryRemoteCaller.deductQuantities(invoice.items);
        invoice.items = updatedItems;
        for (const itm of invoice.items) {
            invoice.totalPrice += itm.salePrice * itm.quantity;
            invoice.totalQuantity += itm.quantity;

            // decrease products quantities
            await Product.findOneAndUpdate({sku: itm.sku}, {$inc: {availableQty: -1 * itm.quantity}}).exec();
        }

        invoice = await invoice.save();

        requests.successHandler(invoice, 'Invoice created successfully', response);
        return response;

    } catch (e) {
        requests.errorHandler(e, response);
        return response;
    }
};


module.exports.updateInvoice = async params => {

    params = JSON.parse(params.body);
    let response = requests.buildResponse();
    try {

        let invoice = await Invoice.findOne({invoiceNumber: params.invoiceNumber});
        if (!invoice) {
            throw new Error("Invoice with number: [" + params.invoiceNumber + "] not found.");
        }

        props.copyProps(params, invoice, ['_id', 'items']);

        invoice.totalPrice = 0;
        invoice.totalQuantity = 0;

        await inventoryRemoteCaller.restoreQuantities(invoice.items);

        // increase products quantities
        for(const itm of invoice.items) {
            await Product.findOneAndUpdate({sku: itm.sku}, {$inc: {availableQty: itm.quantity}}).exec();
        }

        const updatedItems = await inventoryRemoteCaller.deductQuantities(params.items);
        invoice.items = updatedItems;

        // decrease products quantities
        for(const itm of invoice.items) {
            await Product.findOneAndUpdate({sku: itm.sku}, {$inc: {availableQty: -1 * itm.quantity}}).exec();
        }

        invoice = await invoice.save();
        requests.successHandler(invoice, 'Invoice updated successfully', response);
        return response;
    } catch (e) {
        requests.errorHandler(e, response);
        return response;
    }
};


module.exports.removeInvoice = async params => {

    let response = requests.buildResponse();
    try {

        let invoice = await Invoice.findOne({invoiceNumber: params.pathParameters.invoiceNumber});

        if (!invoice) {
            throw new Error("Invoice with number: [" + params.pathParameters.invoiceNumber + "] not found.");
        }

        invoice.totalPrice = 0;
        invoice.totalQuantity = 0;

        await inventoryRemoteCaller.restoreQuantities(invoice.items);

        // increase products quantities
        for(const itm of invoice.items) {
            await Product.findOneAndUpdate({sku: itm.sku}, {$inc: {availableQty: itm.quantity}}).exec();
        }

        invoice = await invoice.remove();
        requests.successHandler(invoice, 'Invoice removed successfully', response);
        return response;
    } catch (e) {
        requests.errorHandler(e, response);
        return response;
    }
};
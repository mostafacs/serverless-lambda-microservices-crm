const requests = require('../utils/request');
const props = require('../utils/props');
const Invoice = require('../models/invoice');
const inventoryRemoteCaller = require('../remote-call/inventory-rc');
require('../db/db');


module.exports.newInvoice = async params => {

    params = JSON.parse(params.body);
    let response = requests.buildResponse();
    try {
        let invoice = new Invoice(params);
        invoice.totalPrice = 0;
        invoice.totalQuantity = 0;


        const updatedItems = inventoryRemoteCaller.deductQuantities(invoice.items);
        invoice.items = updatedItems;
        invoice.items.forEach( itm => {
            invoice.totalPrice += itm.salePrice * itm.quantity;
            invoice.totalQuantity += itm.quantity;
        });

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

        inventoryRemoteCaller.restoreQuantities(invoice.items);

        const updatedItems = inventoryRemoteCaller.deductQuantities(params.items);
        invoice.items = updatedItems;

        invoice = await invoice.save();
        requests.successHandler(invoice, 'Invoice updated successfully', response);
        return response;
    } catch (e) {
        requests.errorHandler(e, response);
        return response;
    }
};
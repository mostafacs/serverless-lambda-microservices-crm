const AWS = require('aws-sdk');
const requests = require('../utils/request');
const props = require('../utils/props');
const Invoice = require('../models/invoice');
require('../db/db');


module.exports.newInvoice = async params => {

    params = JSON.parse(params.body);
    let response = requests.buildResponse();
    try {
        let invoice = new Invoice(params);
        invoice.totalPrice = 0;
        invoice.totalQuantity = 0;

        //---------------------------------   update inventory ------------------------------
        const lambdaOpts = {
            region: 'us-east-1',
        };

        if (process.env.devMode === 'true') {
            lambdaOpts.endpoint = process.env.stockNewInvoiceHandlerEndPoint // 'http://localhost:4000'
        }

        let lambda = new AWS.Lambda(lambdaOpts);

        const lambdaParams = {
            FunctionName: process.env.stockNewInvoiceHandlerFuncName,
            // RequestResponse is important here. Without it we won't get the result Payload
            InvocationType: 'RequestResponse',
            LogType: 'Tail', // other option is 'None'
            Payload: JSON.stringify(invoice.items)
        };


        let response = await lambda.invoke(lambdaParams).promise();
        response = JSON.parse(response.Payload);
        response = JSON.parse(response.body);
        if(!response.success) {
            throw new Error(response.body.message);
        }

        invoice.items = response.data;
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



        invoice = await invoice.save();
        requests.successHandler(product, 'Product updated successfully', response);
        return response;
    } catch (e) {
        requests.errorHandler(e, response);
        return response;
    }
};
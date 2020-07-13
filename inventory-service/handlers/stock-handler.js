const Stock = require('../models/stock');
const Warehouse = require('../models/warehouse');
const requests = require('../utils/request');
const AWS = require('aws-sdk');
require('../db/db');


module.exports.addStock = async (params) => {


    const response = requests.buildResponse();

    try {

        params = JSON.parse(params.body);
        let locationExists = false;
        let whPriority = -1;
        let locPriority = -1;

        const wh = await Warehouse.findOne({warehouseCode: params.warehouseCode});
        if (!wh) {
            throw new Error('Warehouse is not exists');
        }
        whPriority = wh.priority;
        wh.totalQty += params.quantity;
        wh.locations.forEach(location => {
            if (location.locationCode === params.locationCode) {
                location.totalQty += params.quantity;
                locPriority = location.priority;
                locationExists = true;
            }
        });

        if (!locationExists) {
            throw new Error('Location is not exists');
        }

        params.warehousePriority = whPriority;
        params.locationPriority = locPriority;

        let stock = await Stock.findOne({
            warehouseCode: params.warehouseCode,
            locationCode: params.locationCode,
            productSku: params.productSku
        });

        if (stock) {
            stock.quantity += params.quantity;
        } else {
            stock = new Stock(params);
        }
        stock = await stock.save();
        await wh.save();

        // ---------------------------- update product quantity -----------------------
        const updateProductPayload = {default: '', sku: params.productSku, quantity: params.quantity};
        //  const arn = "arn:aws:sns:us-east-1:458929599444:product-amount-update-topic";
        const snsOpts = {
            // endpoint: "http://127.0.0.1:4004/sales-service-dev-product-qty-updater",
            region: "us-east-1",
        };
        if (process.env.devMode) {
            snsOpts.endpoint = process.env.productQtyHandlerEndPoint;
        }
        const sns = new AWS.SNS(snsOpts);
        sns.publish({
            Message: JSON.stringify(updateProductPayload),
            MessageStructure: "json",
            TopicArn: process.env.productQtyHandlerArn
        }, () => {
            console.log("update product total request sent");
        });
        // -----------------------------------------------------------------------------

        requests.successHandler(stock, 'Quantity updated successfully', response);
        return response;

    } catch (e) {
        requests.errorHandler(e, response);
        return response;
    }
};

module.exports.moveStock = async (params) => {


    const response = requests.buildResponse();

    try {
        params = JSON.parse(params.body);
        const fromStock = await Stock.findOne({
            warehouseCode: params.fromWarehouseCode,
            locationCode: params.fromLocationCode,
            productSku: params.productSku
        });

        let toStock = await Stock.findOne({
            warehouseCode: params.toWarehouseCode,
            locationCode: params.toLocationCode,
            productSku: params.productSku
        });

        if (!toStock) {
            toStock = new Stock(
                {
                    warehouseCode: params.toWarehouseCode,
                    locationCode: params.toLocationCode,
                    productSku: params.productSku,
                    quantity: 0
                });
        }

        if (!fromStock) {
            throw new Error('FromStock is not exists');
        }


        if (fromStock.quantity < params.quantity) {
            throw new Error('Insufficient amount on stock to move');
        }


        fromStock.quantity -= params.quantity;
        toStock.quantity += params.quantity;


        await fromStock.save();
        await toStock.save();

        await Warehouse.findOneAndUpdate({
            'locations.locationCode': fromStock.locationCode
        }, {
            $inc: {totalQty: params.quantity * -1 },
            $inc: {'locations.$.totalQty': params.quantity * -1}
        }).exec();

        await Warehouse.findOneAndUpdate({
            'locations.locationCode': toStock.locationCode
        }, {
            $inc: {totalQty: params.quantity },
            $inc: {'locations.$.totalQty': params.quantity }
        }).exec();

        requests.successHandler({}, 'Quantity updated successfully', response);
        return response;

    } catch (e) {
        requests.errorHandler(e, response);
        return response;
    }
};


module.exports.invoiceHandler = async (params) => {

    const response = requests.buildResponse();

    try {

        // params = JSON.parse(params.body);

        // validate quantities first
        for (let i = 0; i < params.length; i++) {

            if (params[i].quantity <= 0) {
                throw new Error("Order quantity for product [" + params[i].sku + "] can't be less than or equal zero ");
            }

            const productQty = await Stock.aggregate([
                {$match: {productSku: params[i].sku}},
                {$group: {_id: null, totalProductsQty: {$sum: "$quantity"}}}
            ]);

            if (productQty[0].totalProductsQty < params[i].quantity) {
                throw new Error("Insufficient Quantity for product " + params[i].sku);
            }
        }

        // do deduct
        for (let i = 0; i < params.length; i++) {

            const param = params[i];
            let currentItemQty = param.quantity;

            const productQty = await Stock.aggregate([
                {$match: {productSku: param.sku}},
                {$group: {_id: null, totalProductsQty: {$sum: "$quantity"}}}
            ]);

            if (productQty[0].totalProductsQty < currentItemQty) {
                throw new Error("Insufficient Quantity for product " + param.sku);
            }


            let stocks = await Stock.find({
                quantity: {$gt: 0},
                productSku: param.sku
            }).sort({warehousePriority: 1, locationPriority: 1, quantity: -1}).limit(50).exec();

            console.log(stocks);

            param.stockLocations = [];

            for (let j = 0; j < stocks.length && currentItemQty > 0; j++) {

                const stock = stocks[j];
                let deductedQty = 0;
                if ((stock.quantity - currentItemQty) < 0) {
                    deductedQty = stock.quantity;
                    currentItemQty -= stock.quantity;
                    param.stockLocations.push({locationCode: stock.locationCode, quantity: stock.quantity});
                    stock.quantity = 0;
                } else {
                    deductedQty = currentItemQty;
                    stock.quantity -= currentItemQty;
                    param.stockLocations.push({locationCode: stock.locationCode, quantity: currentItemQty});
                    currentItemQty = 0;
                }
                await stock.save();

                deductedQty *= -1;
                await Warehouse.findOneAndUpdate({
                    'locations.locationCode': stock.locationCode
                }, {
                    $inc: {totalQty: deductedQty},
                    $inc: {'locations.$.totalQty': deductedQty}
                }).exec();
            }
        }

        requests.successHandler(params, 'Order processed successfully', response);
        return response;

    } catch (e) {
        requests.errorHandler(e, response);
        return response;
    }
};

module.exports.invoiceRestoreHandler = async (params) => {

    const response = requests.buildResponse();

    try {
        for (let i = 0; i < params.length; i++) {
            const item = params[i];
            if (item.stockLocations && item.stockLocations.length > 0) {

                for (const sl of item.stockLocations) {

                     await Stock.findOneAndUpdate({
                        locationCode: sl.locationCode,
                        productSku: item.sku
                    }, {
                         $inc: {quantity: sl.quantity}
                     }).exec();

                    await Warehouse.findOneAndUpdate({
                        'locations.locationCode': sl.locationCode
                    }, {
                        $inc: {totalQty: sl.quantity},
                        $inc: {'locations.$.totalQty': sl.quantity}
                    }).exec();
                }

            }
        }
        requests.successHandler(params, 'Invoice Restore successfully', response);
        return response;
    } catch (e) {
        requests.errorHandler(e, response);
        return response;
    }


};
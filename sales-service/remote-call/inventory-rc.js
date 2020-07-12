
module.exports.deductQuantities = async (invoiceItems) => {
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
        Payload: JSON.stringify(invoiceItems)
    };


    let response = await lambda.invoke(lambdaParams).promise();

    response = JSON.parse(response.Payload);
    response = JSON.parse(response.body);
    if(!response.success) {
        throw new Error(response.body.message);
    }

    return response.data;
}

module.exports.restoreQuantities = async (invoiceItems) => {
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
        Payload: JSON.stringify(invoiceItems)
    };


    let response = await lambda.invoke(lambdaParams).promise();

    response = JSON.parse(response.Payload);
    response = JSON.parse(response.body);
    if(!response.success) {
        throw new Error(response.body.message);
    }

    return response.data;
}



const RC = require('../utils/remote-calls')

module.exports.deductQuantities = (invoiceItems) => {
    return RC.callLambdaSync(process.env.stockNewInvoiceHandlerFuncName, process.env.stockNewInvoiceHandlerEndPoint, invoiceItems);
}

module.exports.restoreQuantities = async (invoiceItems) => {
    return RC.callLambdaSync(process.env.stockRestoreInvoiceHandlerFuncName, process.env.stockRestoreInvoiceHandlerEndPoint, invoiceItems);
}



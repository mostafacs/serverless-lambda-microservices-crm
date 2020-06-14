
module.exports.buildResponse = () => {
    return {
        isBase64Encoded: false,
        statusCode: 200,
        body: null
    };
};

module.exports.successHandler = (data, message, response) => {
    response.body = JSON.stringify({message: message, data: data, success: true});
};

module.exports.errorHandler = (e, response) => {
    response.statusCode = 500;
    response.success = false;
    response.body = JSON.stringify({message: e.message, success: false});
    console.log(e);
};
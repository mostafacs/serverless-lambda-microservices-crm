
module.exports.buildResponse = () => {
    return {
        isBase64Encoded: false,
        statusCode: 200,
        success: true,
        body: null
    };
};

module.exports.successHandler = (data, message, response) => {
    response.body = JSON.stringify({message: message, data: data});
};

module.exports.errorHandler = (e, response) => {
    response.statusCode = 500;
    response.success = false;
    response.body = JSON.stringify({message: e.message});
    console.log(e);
};
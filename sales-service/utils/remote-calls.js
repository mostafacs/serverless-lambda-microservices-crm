const AWS = require('aws-sdk');


module.exports.callLambdaSync = async (funcName, endpoint, payload) => {

    const lambdaOpts = {
        region: 'us-east-1',
    };

    if (endpoint) {
        lambdaOpts.endpoint = endpoint;
    }

    let lambda = new AWS.Lambda(lambdaOpts);

    const lambdaParams = {
        FunctionName: funcName,
        InvocationType: 'RequestResponse',
        LogType: 'Tail', // other option is 'None'
        Payload: JSON.stringify(payload)
    };


    let response = await lambda.invoke(lambdaParams).promise();

    response = JSON.parse(response.Payload);
    response = JSON.parse(response.body);
    if(!response.success) {
        throw new Error(response.body.message);
    }

    return response.data;
}

module.exports.callSNS = async (funcName, endpoint, arn, payload) => {

    const snsOpts = {
        region: "us-east-1",
    };
    if (endpoint) {
        snsOpts.endpoint = endpoint
    }
    const sns = new AWS.SNS(snsOpts);
    sns.publish({
        Message: JSON.stringify(payload),
        MessageStructure: "json",
        TopicArn: arn
    }, () => {
        console.log("SNS message sent to ["+funcName+"]");
    });
}
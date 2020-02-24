'use strict';

const Employee = require('./models/employee');
const db = require('./db/db');

// access_key_id = AKIAWVWSV6PKJ2JKE6SS
// access_key_secret = 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
//  https://6mbkfxyu2e.execute-api.us-east-1.amazonaws.com/dev/employee

// sls invoke local -f saveEmployee --data '{"email": 'engmostafa.cs@gmail.com"}'
module.exports.saveEmployee = async employeeParams => {
    //context.callbackWaitsForEmptyEventLoop = false;
    let response = {
        isBase64Encoded: false,
        statusCode: 200,
        body: null
    };

    try {
        let employee = new Employee(employeeParams);
        employee = await employee.save();
        response.body = JSON.stringify({ message: 'saved', data: employee});
        return response;
    } catch (e) {
        response.statusCode = 500;
        console.log(e);
        return response;
    }

};


module.exports.getEmployee = async data => {
    //context.callbackWaitsForEmptyEventLoop = false;//defaults to true and will result in timeout
    let response = {
        statusCode: 200,
        body: null
    };

    const email = data.pathParameters.email;
    const employee = await Employee.findOne({email: email});
    response.body = JSON.stringify({ message: 'Employee loaded successfully', data: employee});
    return response;
}


// let data = {first_name: 'mostafa', last_name: 'albana', salary: 2523.5, email: 'engmostafa.cs@gmail.com'};
// const promise = mongoose.connect(mongoUrl, options);
// promise.then(() => {
//     let user = new User(data);
//     return user.save();
// }).then((result) => {
//     response.body = JSON.stringify({ message: 'saved', data: result});
//     callback(null, response);
// }).catch(error => {
//     callback(error);
// });
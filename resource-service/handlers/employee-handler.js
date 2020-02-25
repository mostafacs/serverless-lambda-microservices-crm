'use strict';

const Employee = require('../models/employee');


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
    console.log(employee);
    response.body = JSON.stringify({ message: 'Employee loaded successfully', data: employee});
    return response;
}

/*(async () => {
    const db = require('../db/db');
    let data = {
        first_name: 'mostafa',
        last_name: 'albana',
        salary: 2523.5,
        email: 'engmostafa.cs@gmail.com',
        job_type: 0,
        employee_id: 1
    };
    db.connection();
    console.log(await Employee.countDocuments());
    // let user = new Employee(data);
    // console.log(await user.save());
})();*/


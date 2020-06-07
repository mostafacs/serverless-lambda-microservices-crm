'use strict';

const Employee = require('../models/employee');
require('../db/db'); // required


module.exports.saveEmployee = async employeeParams => {
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
        response.body = JSON.stringify({message: e.message});
        console.log(e);
        return response;
    }

};


module.exports.getEmployee = async (data, context) => {
    let response = {
        statusCode: 200,
        body: null
    };

    try {
        const email = data.pathParameters.email;
        const employee = await Employee.findOne({email: email});
        response.body = JSON.stringify({message: 'Employee loaded successfully', data: employee});
        console.log(response);
        return response;
    } catch (e) {
        response.statusCode = 500;
        context.captureError(e);
        return response;
    }
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


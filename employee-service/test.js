const mongoose = require('mongoose')
const mongoUrl = 'mongodb+srv://mostafa:admin@cluster0-opsew.mongodb.net/employees?retryWrites=true&w=majority';
const Employee = mongoose.model('Employee', {
    first_name: { type: String},
    last_name: {type: String},
    email: {type: String, index: true},
    salary: {type: Number, index: true},
    address: [{
        street: {type: String},
        city : {type: String},
        state: {type: String},
        zip: {type: String}
    }]
});


async function test() {
    console.log('>>>>');
    const options = {
        bufferCommands: false, // Disable mongoose buffering
        bufferMaxEntries: 0,
        useNewUrlParser: true,
        useUnifiedTopology: true
    };


    try {

        let data = {first_name: 'xxxxxmostafa', last_name: 'albanaxxx', salary: 2523.5, email: 'engmostafa.cs@gmail.com'};
        console.log('ww');
        await mongoose.connect(mongoUrl, options);
        console.log('xxxx');
        const employee = new Employee(data);
        const result = await employee.save();
        console.log('ttttt');
        // response.body = JSON.stringify({message: 'saved', data: employee});

    } catch (e) {
        console.log('errrrrr');
        console.log(e);
    }

}

test();
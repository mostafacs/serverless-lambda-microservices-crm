const mongoose = require('mongoose');

let db;
const options = {
    bufferCommands: false, // Disable mongoose buffering
    bufferMaxEntries: 0,
    useNewUrlParser: true,
    useUnifiedTopology: true
};

const mongoUrl = 'mongodb+srv://mostafa:admin@cluster0-opsew.mongodb.net/employees?retryWrites=true&w=majority';


async function connection()  {
    if(!db)
        db = await mongoose.connect(mongoUrl, options);
    return db;
};


(async () => {
    await connection();
})();

module.exports.connection = connection;
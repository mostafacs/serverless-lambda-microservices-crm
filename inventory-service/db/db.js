const mongoose = require('mongoose');

let db;
const options = {
    bufferCommands: false, // Disable mongoose buffering
    bufferMaxEntries: 0,
    useNewUrlParser: true,
    useUnifiedTopology: true
};

const mongoUrl = process.env.inventory_db_url;
console.log(mongoUrl);

async function connection()  {
    if(!db) {
        console.log('connect');
        db = await mongoose.connect(mongoUrl, options);
    }
    return db;
};


(async () => {
    return await connection();
})();

module.exports.connection = connection;
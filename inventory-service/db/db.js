const mongoose = require('mongoose');

let db;
const options = {
    bufferCommands: false, // Disable mongoose buffering
    bufferMaxEntries: 0,
    useNewUrlParser: true,
    useUnifiedTopology: false
};

const mongoUrl = process.env.db_url;
console.log(mongoUrl);

async function connection()  {
    if(!db) {
        if(mongoose.connection && mongoose.connection.readyState){
            db = mongoose.connection
        } else {
            console.log('connect');
            db = await mongoose.connect(mongoUrl, options);
        }
    }
    return db;
};


(async () => {
    return await connection();
})();

module.exports.connection = connection;
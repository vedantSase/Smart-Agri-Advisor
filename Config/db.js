const mongoose = require('mongoose');   // importing the mongoose library / package
require('dotenv').config();     //  getting mongo server URL for listening from .env file
const colors = require('colors'); 
const mongoURL = 'mongodb://127.0.0.1:27017/Crop_Recommendation';   // the local url of mongo server
// const mongoURL_Online = <URL>    // the global url of mongo server
mongoose.connect(mongoURL,{ // establishing connection with database 
    useNewUrlParser : true, // always required for getting automatially upgraded 
    useUnifiedTopology : true   // with latest versions of MongoDB
});

// mongoose maintains a default connection object representing the mongoDB connection
const db = mongoose.connection;

db.on('connected',()=>{
    console.log("Connected to mongoose server...".bgGreen);
});
db.on('disconnected',()=>{
    console.log("DataBase connection lost !!!\n--------------------------------".red);
});
db.on('error',()=>{
    console.log("DataBase Server Error occured\n".red);
}); 

// exportig the objects and functions
module.exports = db ;
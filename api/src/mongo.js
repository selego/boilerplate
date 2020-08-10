const mongoose = require("mongoose");
const { MONGO_URL } = require("./config.js");

console.log("Connect to MONGO ");
//Set up default mongoose connection

mongoose.connect(MONGO_URL); // Get Mongoose to use the global promise library

console.log("Run", MONGO_URL);
mongoose.Promise = global.Promise; //Get the default connection
let db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => console.log("CONNECTED OK"));

module.exports = db;

const configExpress = require('./configExpress.js')
const configDB = require('./configDB.js');

// Configure and start Express server
configExpress();

// Connect to the MongoDB database
configDB();

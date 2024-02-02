const { config } = require('dotenv');

config();

module.exports = { MONGODB_URI, PORT } = process.env;
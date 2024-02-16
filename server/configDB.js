const mongoose = require('mongoose');
const { MONGODB_URI } = require('./dotenv.js');

const configDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to the DB");

  } catch (error) {
    console.error("Error connecting to the DB:", error);
    process.exit(1); // Exit the process on a critical error
  }
};

module.exports = configDB;

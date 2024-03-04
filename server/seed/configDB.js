const mongoose = require('mongoose');
const { MONGODB_URI } = require('../dotenv.js');

// Function to connect to MongoDB
const connectToDB = async () => {
  try {
    // Attempt to connect to the MongoDB instance using the provided URI
    await mongoose.connect(MONGODB_URI);

    const db = mongoose.connection;

    console.log('Connected to database:', db.name);
  } catch (error) {
    console.error("Error connecting to the database:", error);

    // Terminate the process if connection fails
    process.exit(1);
  }
};

module.exports = connectToDB;

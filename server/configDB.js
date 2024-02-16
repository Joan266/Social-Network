const mongoose = require('mongoose');
const mongodb = require('mongodb');
const { MONGODB_URI } = require('./dotenv.js');

const configDB = async () => {
  try {
    // Create a connection to the MongoDB database
    const conn =  mongoose.createConnection(MONGODB_URI);
    console.log("Connected to the DB");

    
    // conn.once('open', () => {
    //   // Init stream
    //   const bucket = new mongodb.GridFSBucket(conn.db, { bucketName: 'uploads',chunkSizeBytes: 161120, });
    //   console.log(bucket)
    // });

    // Return any necessary objects, in case you need them in other parts of your application
    return { conn };
  } catch (error) {
    console.error("Error connecting to the DB:", error);
    process.exit(1); // Exit the process on a critical error
  }
}; 

module.exports = configDB;

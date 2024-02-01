import mongoose from "mongoose";
import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { MONGODB_URI, PORT } from './dotenv.js';

const configExpress = async () => {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());


  // Error Handling Middleware
  app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
  })  

  const httpServer = createServer(app);

  httpServer.listen(PORT || 5000, () => {
    console.log(`Listening on port ${process.env.PORT || 5000}`);
  });

};

const configDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to the DB");

  } catch (error) {
    console.error("Error connecting to the DB:", error);
    process.exit(1); // Exit the process on a critical error
  }
};

// Configure and start Express server
await configExpress();
// Connect to the MongoDB database
configDB();
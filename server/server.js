const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors');
const {createServer} = require('http');
const { MONGODB_URI, PORT } = require('./dotenv.js');

const userRoutes = require('./routes/user')

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

  //routes
  app.use('/api/user', userRoutes)

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
configExpress();

// Connect to the MongoDB database
configDB();
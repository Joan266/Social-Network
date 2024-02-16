const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const {createServer} = require('http');
const configDB = require('./configDB.js');
const userRoutes = require('./routes/user')
const postRoutes = require('./routes/post')
const filesRoutes = require('./routes/files.js')

const { PORT } = require('./dotenv.js');

const configExpress = async () => {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());

  // Parse JSON bodies
  app.use(bodyParser.json());

  // Error Handling Middleware
  app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
  })  

  //routes
  app.use('/api/user', userRoutes)
  app.use('/api/post', postRoutes)
  app.use('/api/files', filesRoutes)

  const httpServer = createServer(app);

  httpServer.listen(PORT || 5000, () => {
    console.log(`Listening on port ${PORT || 5000}`);
  });

};

// Configure and start Express server
configExpress();

// Connect to the MongoDB database
configDB();

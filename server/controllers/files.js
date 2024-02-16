const fs = require('fs'); // Import the 'fs' module for file operations
const mongoose = require('mongoose');
const Grid = require('gridfs-stream');
const connection = mongoose.connection;
const File = require('../models/file'); // Import Mongoose model for files

// Initialize GridFS stream
let gfs;

connection.once('open', () => {
    gfs = Grid(connection.db, mongoose.mongo);
    gfs.collection('uploads');
});

// Set the destination folder for temporary file storage
module.exports = filesController =  {
  upload: async (req, res) => {
    try {
        // Create a new file instance
        const newFile = new File({
            filename: req.file.originalname,
            contentType: req.file.mimetype
        });
  
        // Save file metadata to MongoDB
        await newFile.save();
  
        // Create a writestream to store file data in GridFS
        const writestream = gfs.createWriteStream({
            filename: req.file.originalname,
            metadata: newFile._id // Attach file ID as metadata
        });
  
        // Pipe the uploaded file from multer into the GridFS writestream
        const readstream = fs.createReadStream(req.file.path);
        readstream.pipe(writestream);
  
        // Once upload is complete, remove temporary file and respond to client
        writestream.on('close', () => {
            fs.unlink(req.file.path, () => {
                res.status(201).send('File uploaded successfully');
            });
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
  }
}
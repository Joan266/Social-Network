const mongoose = require('mongoose');

// Define schema for file metadata
const fileSchema = new mongoose.Schema({
    filename: String,
    contentType: String,
    uploadDate: { type: Date, default: Date.now }
});

// Create Mongoose model for files
const File = mongoose.model('File', fileSchema);

module.exports = File;

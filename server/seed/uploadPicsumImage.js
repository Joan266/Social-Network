const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const fetch = require('node-fetch');

let gfs;

const connection = mongoose.connection;

connection.once('open', () => {
  gfs = new mongoose.mongo.GridFSBucket(connection.db);
});

// Function to upload image from URL
const uploadPicsumImage = async ({url, width, height}) => {
  try {
    // Fetch the image from the provided URL
    const response = await fetch(url);

    // Check if response is successful
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    // Get the ID from the response headers
    const picsumID = response.headers.get('Picsum-ID');
    
    // Read the response body as Buffer
    const buffer = await response.buffer();

    // Check if the file is an image based on its MIME type
    if (!response.headers.get('content-type').startsWith('image/')) {
      throw new Error('Only image files are allowed');
    }

    // Generate an encrypted version of the original filename (replace 'file.originalname' with actual filename)
    const saltRounds = 7;
    const encryptedFilename = await bcrypt.hash(url, saltRounds);

    // Open a GridFS upload stream
    const uploadStream = gfs.openUploadStream(encryptedFilename, {
      chunkSizeBytes: 262144, // 256 KB
      metadata: { contentType: response.headers.get('content-type'), picsumID, width, height }
    });

    // Pipe the buffer data to the upload stream
    uploadStream.end(buffer);

    // Return the encrypted filename after upload
    return new Promise((resolve, reject) => {
      uploadStream.on('finish', () => {
        resolve({ encryptedFilename, picsumID });
      });
      uploadStream.on('error', (error) => {
        reject(error);
      });
    });
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    throw error; // Rethrow the error to handle it outside this function
  }
};

module.exports = uploadPicsumImage;

const fs = require('fs');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const connection = mongoose.connection;

let gfs;

connection.once('open', () => {
    gfs = new mongoose.mongo.GridFSBucket(connection.db);
});

module.exports = filesController = {

    upload: async (req, res) => {
        try {
            const { file } = req;
            // Check if the file is an image based on its MIME type
            if (!file.mimetype.startsWith('image/')) {
                return res.status(400).json({ error: 'Only image files are allowed' });
            }

            // Generate an encrypted version of the original filename
            const saltRounds = 7;
            const encryptedFilename = await bcrypt.hash(file.originalname, saltRounds);
            const uploadStream = gfs.openUploadStream(encryptedFilename,{
                chunkSizeBytes: 262144,
                metadata: {contentType: file.mimetype}
            });

            const readStream = fs.createReadStream(file.path);
            readStream.pipe(uploadStream);

            uploadStream.on('finish', () => {
                fs.unlink(file.path, () => {
                    res.status(201).json({ fileId: encryptedFilename });
                });
            });
        } catch (error) {
            console.log(`Error: ${error}`)
            res.status(400).json({
                error: 'Bad Request',
            })
        }
    },
    image: async (req, res) => {
        const { fileId } = req.query;
        
        try {
            // Find the files by filename:fileId
            const files = await gfs.find({ filename: fileId }).toArray();

            // Check if file is not found
            if (!files || files.length === 0) {
                return res.status(404).json({ error: 'File not found' });
            }
            
            // Open a download stream for the specified fileId
            const readstream = gfs.openDownloadStream(files[0]._id);
            
            // Set content type based on file metadata
            res.set('Content-Type', files[0].metadata.contentType );  
            // Pipe the file data directly to the response
            readstream.pipe(res);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },
    
    delete: async (req, res) => {
        const { fileId } = req.query;
        try {
            // Find the files by filename:fileId
            const files = await gfs.find({ filename: fileId }).toArray();
            // Check if file is not found
            if (!files || files.length === 0) {
                return res.status(404).json({ error: 'File not found' });
            }
            // Delete the file from GridFS
            await gfs.delete(files[0]._id);
            res.status(200).json({ message: 'File deleted successfully' });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }     
};

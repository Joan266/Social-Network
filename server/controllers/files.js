const fs = require('fs');
const mongoose = require('mongoose');
const { GridFSBucket } = require('mongoose');

const connection = mongoose.connection;
const File = require('../models/file');

let gfs;

connection.once('open', () => {
    gfs = new mongoose.mongo.GridFSBucket(connection.db);
});

module.exports = filesController = {
    upload: async (req, res) => {
        try {
            const { file } = req;
            console.log(file, file.originalname);
            // Check if the file is an image based on its MIME type
            if (!file.mimetype.startsWith('image/')) {
                return res.status(400).json({ error: 'Only image files are allowed' });
            }
            const newFile = new File({
                filename: file.originalname,
                contentType: file.mimetype
            });

            await newFile.save();
            console.log(newFile);

            const uploadStream = gfs.openUploadStream(newFile._id.toString());

            const readStream = fs.createReadStream(file.path);
            readStream.pipe(uploadStream);

            uploadStream.on('finish', () => {
                fs.unlink(file.path, () => {
                    res.status(201).json({fileId: newFile._id});
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
            const files = await gfs.find({ filename: fileId }).toArray();
            
            if (!files || files.length === 0) {
                return res.status(404).json({ error: 'File not found' });
            }
            console.log("file",files[0])
            const fileData = await File.findById(fileId);
            res.set('Content-Type', fileData.contentType);  
            // Assuming you want the first file found
            const readstream = gfs.openDownloadStream(files[0]._id);
            readstream.pipe(res); // Pipe the file data directly to the response
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }     
};

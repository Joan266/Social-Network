const fs = require('fs');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Post = require('../models/post')
const connection = mongoose.connection;

let gfs;

connection.once('open', () => {
    gfs = new mongoose.mongo.GridFSBucket(connection.db);
});

module.exports = filesController = {

    upload: async (req, res) => {
        try {
            const { file, width, height } = req;
            // Check if the file is an image based on its MIME type
            if (!file.mimetype.startsWith('image/')) {
                return res.status(400).json({ error: 'Only image files are allowed' });
            }

            // Generate an encrypted version of the original filename
            const saltRounds = 7;
            const encryptedFilename = await bcrypt.hash(file.originalname, saltRounds);
            const uploadStream = gfs.openUploadStream(encryptedFilename,{
                chunkSizeBytes: 262144,
                metadata: { contentType: file.mimetype, width, height}
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
    postImgData: async (req, res) => {
        const { postId } = req.query;
    
        try {
            console.log(postId)
            // Use Mongoose to search for post
            const post = await Post.findById(postId)

            // Check if file is not found
            if (!post || !post.postImageFileId) {
                return res.status(200).json({ msg: 'Post image id not found' });
            }

            // Find the files by filename:fileId
            const files = await gfs.find({ filename: post.postImageFileId }).toArray();
    
            // Check if file is not found
            if (!files || files.length === 0) {
                return res.status(404).json({ error: 'File not found' });
            }
    
            // Extract metadata
            const { contentType } = files[0].metadata;
    
    
            // Set content type for the file data
            res.set('Content-Type', contentType);
    
            // Open a download stream for the specified fileId
            const readstream = gfs.openDownloadStream(files[0]._id);
    
            // Pipe the file data directly to the response
            readstream.pipe(res);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },
    profilePicData: async (req, res) => {
        const { postId } = req.query;
    
        try {
            console.log(postId)
            // Use Mongoose to search for post
            const post = await Post.findById(postId)
            .populate({ path: 'user', select: 'profilePicId' })
            .select('user')
            .exec()

            // Check if file is not found
            if (!post || !post.user || !post.user.profilePicId) {
                return res.status(200).json({ msg: 'User profile pic id post not found' });
            }

            // Find the files by filename:fileId
            const files = await gfs.find({ filename: post.user.profilePicId }).toArray();
    
            // Check if file is not found
            if (!files || files.length === 0) {
                return res.status(404).json({ error: 'File not found' });
            }
    
            // Extract metadata
            const { contentType } = files[0].metadata;
    
    
            // Set content type for the file data
            res.set('Content-Type', contentType);
    
            // Open a download stream for the specified fileId
            const readstream = gfs.openDownloadStream(files[0]._id);
    
            // Pipe the file data directly to the response
            readstream.pipe(res);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },
    imgMetadata: async (req, res) => {
        const { fileId } = req.query;
    
        try {
            // Find the files by filename:fileId
            const files = await gfs.find({ filename: fileId }).toArray();
    
            // Check if file is not found
            if (!files || files.length === 0) {
                return res.status(404).json({ error: 'File not found' });
            }
    
            // Extract metadata
            const { width, height } = files[0].metadata;
    
            // Create a JSON object for metadata
            const metadata = { width, height };
    
            // Send the metadata as JSON
            res.status(200).json(metadata);
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

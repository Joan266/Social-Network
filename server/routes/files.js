const express = require('express');
const filesController = require('../controllers/files');
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

// @route POST /upload
// @desc  Uploads file to DB
router.post('/upload', upload.single('file'))

// @route GET /image/:filename
// @desc Display Image
router.get('/image', requireAuth, filesController.image);

// @route DELETE /files/:id
// @desc  Delete file
router.delete('/file', requireAuth, filesController.delete);


module.exports = router
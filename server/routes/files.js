const express = require('express');
const filesController = require('../controllers/files');
const requireAuth = require('../middleware/requireAuth')
const upload = require('../multerConfig')
const router = express.Router()

// ulpoad file route
router.post('/upload', upload.single('file'), requireAuth,  filesController.upload);

// get image route
router.get('/image', requireAuth,  filesController.image);

module.exports = router;
const express = require('express');
const filesController = require('../controllers/files');
const requireAuth = require('../middleware/requireAuth')
const upload = require('../multerConfig')
const router = express.Router()

// get profile pic data
router.get('/profilebannerdata', requireAuth,  filesController.profileBannerData);

// get profile pic data
router.get('/profilepicdata', requireAuth,  filesController.profilePicData);

// get post image data
router.get('/postimagedata', requireAuth,  filesController.postImageData);

// get post image metadata
router.get('/postimagemetadata', requireAuth,  filesController.postImageMetadata);

// ulpoad file route
router.post('/upload', upload.single('file'), requireAuth,  filesController.upload);

// delete file route
router.delete('/delete', requireAuth,  filesController.delete);

module.exports = router;
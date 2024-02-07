const express = require('express');
const postController = require('../controllers/post');
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

// create post route
router.post('/create', requireAuth, postController.create);

module.exports = router
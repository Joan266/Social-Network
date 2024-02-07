const express = require('express');
const postController = require('../controllers/post');
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

// create post route
router.post('/create', requireAuth, postController.create);

// get post data route
router.get('/fetchdata', requireAuth, postController.fetchPostData);

module.exports = router
const express = require('express');
const postController = require('../controllers/post');
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

// create post route
router.post('/create', requireAuth, postController.create);

// get post data route
router.get('/fetchdata', requireAuth, postController.fetchPostData);

// like post route
router.put('/like', requireAuth, postController.likePost);

// unlike post route
router.put('/unlike', requireAuth, postController.unlikePost);

// isliking post route
router.post('/isliking', requireAuth, postController.isLikingPost);



module.exports = router
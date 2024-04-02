const express = require('express');
const postController = require('../controllers/post');
const requireAuth = require('../middleware/requireAuth')
const router = express.Router()

// create post route
router.post('/create', requireAuth,  postController.create);

// delete post route
router.post('/delete', requireAuth,  postController.delete);

// get post data route
router.get('/fetchpostdata', requireAuth, postController.fetchPostData);

// like post route
router.put('/like', requireAuth, postController.likePost);

// unlike post route
router.put('/unlike', requireAuth, postController.unlikePost);

// isliking post route
router.post('/isliking', requireAuth, postController.isLikingPost);

// home posts
router.get('/homeposts', requireAuth, postController.homePosts)

// post replies
router.get('/replies', requireAuth, postController.postReplies)


module.exports = router
const express = require('express');
const userController = require('../controllers/user');
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

// signup rout
router.post('/signup', userController.signupUser)

// login route
router.get('/login', userController.loginUser)

// search user route
router.post('/search', requireAuth, userController.searchUser);

// get user data route
router.get('/fetchdata', requireAuth, userController.fetchUserData);

// get user posts route
router.get('/fetchposts', requireAuth, userController.fetchUserPosts);

// get user posts route
router.get('/whotofollow', requireAuth, userController.whoToFollow);

// isfolling user route
router.post('/isfollowinguser', requireAuth, userController.isFollowingUser);

// Update privacy status user route
router.put('/updateprofiledata', requireAuth, userController.updateProfileData);

// follow user route
router.put('/follow', requireAuth, userController.followUser);

// unfollow user route
router.put('/unfollow', requireAuth, userController.unfollowUser);

module.exports = router
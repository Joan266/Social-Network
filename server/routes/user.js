const express = require('express');
const userController = require('../controllers/user');
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

// signup rout
router.post('/signup', userController.signupUser)

// login route
router.post('/login', userController.loginUser)

// search user route
router.get('/search', requireAuth, userController.searchUser);

// get user route
router.get('/get', requireAuth, userController.fetchUserData);

// Update privacy status user route
router.put('/updateprivacystatus', requireAuth, userController.updatePrivacyStatus);

// follow user route
router.put('/follow', requireAuth, userController.followUser);

// unfollow user route
router.put('/unfollow', requireAuth, userController.unfollowUser);

module.exports = router
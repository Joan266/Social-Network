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

module.exports = router
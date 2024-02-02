const express = require('express');

// controller 
const userController = require('../controllers/user');

const router = express.Router()

// signup rout
router.post('/signup', userController.signupUser)

module.exports = router
import express from 'express'

// controller 
import userController from '../controllers/user.js';

const router = express.Router()

// signup rout
router.post('/signup', userController.signupUser)

module.exports = router
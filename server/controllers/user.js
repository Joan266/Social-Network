const User = require('../models/user');
const jwt = require('jsonwebtoken')

const createToken = (_id) => {
  return jwt.sign({_id}, process.env.SECRET, { expiresIn: '2d' })
}

module.exports = userController =  {
  signupUser: async (req, res) => {
    const {email, password, username} = req.body
    try {
      const user = await User.signup({email, password, username})
      const { _id } = user;
  
      // create a token
      const token = createToken(user._id)

      res.status(200).json({ _id, email, token, username})
    } catch (error) {
      res.status(400).json({
        error: 'Bad Request',
        message: error.message,
      })
    }
  },

  loginUser: async (req, res) => {
    const {emailOrUsername, password} = req.body
  
    try {
      const user = await User.login({emailOrUsername, password})
      const { _id, username, email } = user;

      // create a token
      const token = createToken(_id)

      res.status(200).json({ _id, email, token, username})
    } catch (error) {
      res.status(400).json({
        error: 'Bad Request',
        message: error.message,
      })
    }
  }
};

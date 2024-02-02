const User = require('../models/user');

module.exports = userController =  {
  signupUser: async (req, res) => {
    const {email, password} = req.body
    try {
      await User.signup(email, password)
  
      res.status(200).json({email})
    } catch (error) {
      res.status(400).json({
        error: 'Bad Request',
        message: error.message,
      })
    }
  },
};

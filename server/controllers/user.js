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
  },

  searchUser: async (req, res) => {
    try {
      const { query } = req.query;

      // Use Mongoose to search for users
      const users = await User.find({
        $or: [
          { username: { $regex: new RegExp(query, 'i') } },
          { email: { $regex: new RegExp(query, 'i') } },
        ],
      })
        .select('-_id -__v -password')
        .limit(10)

      res.status(200).json(users);
    } catch (error) {
      console.error("Error searching for users:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  getUser: async (req, res) => {
    try {
      const { query } = req.query;

      // Use Mongoose to search for users
      const user = await User.findOne({ username: query }).select('-_id -__v -password');

      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ error: "User not found" });
      }
    } catch (error) {
      console.error("Error getting user:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
};

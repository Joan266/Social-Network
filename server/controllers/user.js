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
      const { query, userId } = req.body;

      // Use Mongoose to search for users
      const users = await User.find({
        $and: [
          { 
            $or: [
              { username: { $regex: new RegExp(query, 'i') } },
              { email: { $regex: new RegExp(query, 'i') } },
            ]
          },
          { 
            $or: [
              { following: userId }, 
              { privacyStatus: false }, 
            ]
          }
        ]
      })
        .select('-_id -__v -password')
        .limit(10)
      res.status(200).json(users);
    } catch (error) {
      console.error("Error searching for users:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  fetchUserData: async (req, res) => {
    try {
      const { query } = req.query;

      // Use Mongoose to search for user
      const user = await User.findOne({ username: query }).select('-_id -__v -password -following -followers');

      if (user) {
        console.log(user)
        res.status(200).json(user);
      } else {
        res.status(404).json({ error: "User not found" });
      }
    } catch (error) {
      console.error("Error getting user:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  fetchUserPosts: async (req, res) => {
    try {
      const { query } = req.query;

      // Use Mongoose to search for user
      const user = await User.findOne({ username: query })
        .select('posts')
        .populate({ 
            path: 'posts',
            options: { sort: { createdAt: -1 } },
            select: '_id' 
        });
      console.log(user.posts);
      if (user) {
        res.status(200).json(user.posts);
      } else {
        res.status(404).json({ error: "User posts not found" });
      }
    } catch (error) {
      console.error("Error getting user posts:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  isFollowingUser: async (req, res) => {
    try {
      const { userId, profileUsername } = req.body;
      
      // Use Mongoose to search for user
      const isFollowing = await User.findOne({ username: profileUsername, followers: userId });

      if (isFollowing) {
        res.status(200).json(true);
      } else {
        res.status(200).json(false);
      }
    } catch (error) {
      console.error("Error getting user:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  updateProfileData: async (req, res) => {
    try {
      const { userDataUpdate, userId } = req.body;
      console.log(userDataUpdate)
      // Use Mongoose to search for user
      const userUpdated = await User.findByIdAndUpdate(userId, { ...userDataUpdate }, { new: true });

      if (userUpdated) {
        console.log(`user succesfully updated ${userUpdated}`)
        res.status(200).json();
      } else {
        res.status(404).json({ error: "User not found" });
      }
    } catch (error) {
      console.error("Error getting user:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  followUser: async (req, res) => {
    try {
      const { followerId, followedUsername } = req.body;
  
      // Check if required fields are provided
      if (!followerId || !followedUsername) {
        return res.status(400).json({ error: "Required fields missing" });
      }
  
      // Use Mongoose to search for user to follow
      const userFollowed = await User.findOneAndUpdate(
        { username: followedUsername },
        { $push: { followers: followerId }, $inc: { followersCount: 1 } },
        { new: true }
      );
  
      // Check if user to follow exists
      if (!userFollowed) {
        return res.status(404).json({ error: "User to follow not found" });
      }
  
      // Use Mongoose to search for follower user
      const userFollowing = await User.findByIdAndUpdate(
        followerId,
        { $push: { following: userFollowed._id }, $inc: { followingCount: 1 } },
        { new: true }
      );
  
      // Check if follower user exists
      if (!userFollowing) {
        return res.status(404).json({ error: "Follower user not found" });
      }
  
      // Both operations successful, return success response
      res.status(200).json();
    } catch (error) {
      console.error("Error following user:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  unfollowUser: async (req, res) => {
    try {
      const { followerId, followedUsername } = req.body;
  
      // Check if required fields are provided
      if (!followerId || !followedUsername) {
        return res.status(400).json({ error: "Required fields missing" });
      }
  
      // Use Mongoose to search for user to unfollow
      const userFollowed = await User.findOneAndUpdate(
        { username: followedUsername },
        { $pull: { followers: followerId }, $inc: { followersCount: -1 } },
        { new: true }
      );
  
      // Check if user to unfollow exists
      if (!userFollowed) {
        return res.status(404).json({ error: "User to unfollow not found" });
      }
  
      // Use Mongoose to search for follower user
      const userFollowing = await User.findByIdAndUpdate(
        followerId,
        { $pull: { following: userFollowed._id }, $inc: { followingCount: -1 } },
        { new: true }
      );
  
      // Check if follower user exists
      if (!userFollowing) {
        return res.status(404).json({ error: "Follower user not found" });
      }
  
      // Both operations successful, return success response
      res.status(200).json();
    } catch (error) {
      console.error("Error unfollowing user:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  
};

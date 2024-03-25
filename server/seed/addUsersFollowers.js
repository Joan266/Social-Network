const mongoose = require('mongoose');
const User = require('../models/user');
const shuffleArray = require('./shuffleArray');

// Function to add followers to users
const addUsersFollowers = async ({ usersIds }) => {
  for (const userId of usersIds) {
    // Generate a random number of followers for the user
    const randomNumOfFollowers = Math.floor(Math.random() * usersIds.length);
    const followersIds = usersIds.slice(0, randomNumOfFollowers);
    
    // Shuffle the usersIds array before each iteration
    shuffleArray(usersIds);
    
    try {
      const userToFollow = await User.findOneAndUpdate(
        { _id: userId },
        { followers: followersIds, followersCount: randomNumOfFollowers },
        { new: true }
      );
      
      for (const followerId of followersIds) {
        await User.findOneAndUpdate(
          { _id: followerId },
          { $push: { following: userId }, $inc: { followingCount: 1 } }
        );
      }
    } catch (error) {
      console.error(`Error adding followers to user ${userId}:`, error);
    }
  }
};

module.exports = addUsersFollowers;

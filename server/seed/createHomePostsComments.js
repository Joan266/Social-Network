const faker = require('faker');
const shuffleArray = require('./shuffleArray');
const Post = require('../models/post');
const User = require('../models/user');
const mongoose = require('mongoose');

// Function to create comments for picture posts
const createPostComments = async ({ homePosts, usersIds }) => {
  for (const post of homePosts) {
    const { _id, createdAt: picPostCreatedAt, likesCount } = post;

    // Shuffle the usersIds array before each iteration
    shuffleArray(usersIds);

    // Generate a random number of comments for the post
    const randomNumOfComments = Math.floor(Math.random() * likesCount);

    for (let i = 1; i <= randomNumOfComments; i++) {
      // Generate a random creation date for the comment within the range of the picture post creation date and now
      const createdAt = faker.date.between(picPostCreatedAt, new Date());

      // Generate a random number of likes for the comment
      const randomNumOfLikes = Math.floor(Math.random() * likesCount);

      // Generate a random user ID for the comment
      const randomIndexUser = Math.floor(Math.random() * usersIds.length);
      const userId = usersIds[randomIndexUser];

      // Create a list of users who liked the comment
      const likes = usersIds.slice(0, randomNumOfLikes);

      // Create a new comment using the Post model
      const comment = await Post.create({
        _id: new mongoose.Types.ObjectId(),
        content: "this is a comment",
        likesCount: likes.length,
        likes,
        reply: _id, // Reference to the parent post
        user: userId,
        createdAt,
      });
      
      // Update the comments array of the parent post
      await Post.findByIdAndUpdate(
        _id,
        { $push: { comments: comment._id }, $inc: { commentsCount: 1 } } // Increment commentsCount by 1
      );

      // Update the user document to include the new comment ID in the posts array
      await User.findByIdAndUpdate(
        userId,
        { $push: { posts: comment._id } }
      );

      console.log(`Comment created succesfully: ${comment}`);
    }
  }
};

module.exports = createPostComments;

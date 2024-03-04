const faker = require('faker');
const mongoose = require('mongoose');

const Post = require('../models/post');
const User = require('../models/user');

const shuffleArray = require('./shuffleArray');

// Function to create comments for picture posts
const createPostComments = async ({ homePostsInfo, usersIds }) => {
  for (const post of homePostsInfo) {
    const { _id, createdAt: picPostCreatedAt, likesCount } = post;

    // If there are no likes on the post, skip creating comments
    if (likesCount <= 0) continue;

    // Generate a random number of comments for the post
    const randomNumOfComments = Math.floor(Math.random() * likesCount);

    // If there are no comments to create, skip to the next post
    if (randomNumOfComments <= 0) continue;

    // Shuffle the usersIds array before each iteration
    shuffleArray(usersIds);

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
        content: "This is a comment",
        likesCount: likes.length,
        likes,
        parentPost: _id, // Reference to the parent post
        user: userId,
        createdAt,
      });
      
      // Update the comments array of the parent post and increment commentsCount
      await Post.findByIdAndUpdate(
        _id,
        { $push: { comments: comment._id }, $inc: { commentsCount: 1 } }
      );

      // Update the user document to include the new comment ID in the posts array
      await User.findByIdAndUpdate(
        userId,
        { $push: { posts: comment._id } }
      );
    }
  }
};

module.exports = createPostComments;

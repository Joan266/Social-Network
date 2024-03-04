const Post = require('../models/post');
const User = require('../models/user');
const mongoose = require('mongoose');
const faker = require('faker');
const shuffleArray = require('./shuffleArray');

// Function to create home posts
const createHomePosts = async ({ usersIds, postImageFileIds }) => {
  
  const homePostsInfo = []; // Array to store created posts

  // Calculate a date three days ago
  const threeDaysAgo = new Date();
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

  shuffleArray(postImageFileIds); // Shuffle the postImageFileIds array

  // Iterate over each post image file id
  for (const postImageFileId of postImageFileIds) {
    shuffleArray(usersIds); // Shuffle the usersIds array before each iteration
    
    // Generate a random creation date for the post
    const createdAt = faker.date.between(threeDaysAgo, new Date());

    // Generate a random user ID
    const randomNum = Math.floor(Math.random() * usersIds.length);
    const userId = usersIds[randomNum];

    // Create a list of users who liked the post
    const likes = usersIds.slice(0, randomNum);
    const likesCount = likes.length

    // Create a new post document using the Post model
    const post = await Post.create({
      _id: new mongoose.Types.ObjectId(), // Generate a new object ID
      postImageFileId,
      likesCount,
      likes,
      user: userId,
      createdAt,
    });
    
    // Store the created post in the homePostsInfo array
    homePostsInfo.push({ _id: post._id, createdAt: post.createdAt, likesCount });
    
    // Update the user document to include the new post ID in the posts array
    await User.findByIdAndUpdate(
      userId,
      { $push: { posts: post._id } }
    );
    
    console.log(`post created succesfully: ${post}`);
  }
  return homePostsInfo
};

// Export the createHomePosts function
module.exports = createHomePosts;

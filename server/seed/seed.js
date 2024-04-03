const mongoose = require('mongoose');
const User = require('../models/user');
const Post = require('../models/post');

// Import functions for uploading profile pics, banners, and home posts images
const uploadProfilesPicAndBanner = require('./uploadProfilesPicAndBanner');
const uploadHomePostsImageList = require('./uploadHomePostsImageList');

// Import functions for creating users, home posts, and home post comments
const createUsers = require('./createUsers');
const createHomePosts = require('./createHomePosts');
const createHomePostsComments = require('./createHomePostsComments');
const addUsersFollowers = require('./addUsersFollowers');

const configDB = require('./configDB')

// Connect to MongoDB
configDB();

// Function to seed users, posts, and comments
const seedUsers = async () => {
  try {
    // Delete all existing users
    await User.deleteMany({});
    console.log('All existing users deleted.');

    // Delete all existing posts
    await Post.deleteMany({});
    console.log('All existing posts deleted.');

    // Delete all documents in fs.files
    await mongoose.connection.db.collection('fs.files').deleteMany({});
    console.log('All documents in fs.files deleted.');

    // Delete all documents in fs.chunks
    await mongoose.connection.db.collection('fs.chunks').deleteMany({});
    console.log('All documents in fs.chunks deleted.');

    // Constants for seed data
    const USERS_NUM = 40;
    const POSTS_NUM = 100;
    const POSTS_PAGE = 4;
    const profilePicUrl = "https://picsum.photos/150.webp";
    const bannerUrl = "https://picsum.photos/600/200.webp";
    const homePostsUrl = `https://picsum.photos/v2/list?page=${POSTS_PAGE}&limit=${POSTS_NUM}`;

    // Upload profile pics and banners
    console.log('Uploading profile pictures and banners...');
    const { profilePicFilesInfo, bannerFilesInfo } = await uploadProfilesPicAndBanner({ USERS_NUM, profilePicUrl, bannerUrl });
    console.log('Profile pictures and banners uploaded successfully.');

    // Upload home posts images
    console.log('Uploading home posts images...');
    const postImageFileIds = await uploadHomePostsImageList(homePostsUrl);
    console.log('Home posts images uploaded successfully.');

    // Create users
    console.log('Creating users...');
    const usersIds = await createUsers({ USERS_NUM, profilePicFilesInfo, bannerFilesInfo });
    console.log('Users created successfully.');

    // Add users followers
    console.log('Adding users followers...');
    await addUsersFollowers({ usersIds });
    console.log('Users followers added');

    // Create home posts
    console.log('Creating home posts...');
    const homePostsInfo = await createHomePosts({ usersIds, postImageFileIds });
    console.log('Home posts created successfully.');

    // Create home post comments
    console.log('Creating home post comments...');
    await createHomePostsComments({ homePostsInfo, usersIds });
    console.log('Home post comments created successfully.');

    console.log('Seed data successfully added!');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    // Disconnect from MongoDB
    mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  }
};

// Call the seed function
seedUsers();

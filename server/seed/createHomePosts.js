const Post = require('../models/post');
const User = require('../models/user');
const mongoose = require('mongoose');
const faker = require('faker');
const shuffleArray = require('./shuffleArray');

const fakePostContent = [
  "🌅☀️ Enjoying the breathtaking sunset view!",
  "Exploring hidden gems in the city streets. 🏙️",
  "Feeling grateful for moments like these. ☀️ #Gratitude",
  "Indulging in some self-care this weekend. 💆‍♂️🧖‍♀️ #SelfLove",
  "☕️☕️☕️ Savoring every sip of this delicious coffee. CoffeeLover",
  "Chasing dreams and catching sunbeams. ✨ #DreamChaser",
  "Weekend vibes got me like... 🎉🎉🎉🎉 ",
  "Embracing the beauty of simplicity. 🌿 #SimpleLiving",
  "Lost in the pages of a good book. 📖 #Bookworm",
  "Creating memories one adventure at a time. #AdventureAwaits",
  "Life is better with friends by your side. #FriendshipGoals",
  "Feeding my wanderlust soul with new experiences. #Wanderlust",
  "💃💃😊 Dancing through life with a smile on my face. JoyfulLife",
  "🌼 🌼Taking a moment to appreciate the little things.🌼 🌼 GratefulHeart",
  "Capturing moments that make my heart sing. 📸🎶 #Memories",
  "Embracing the beauty of a rainy day with a cozy blanket and a good book. 🌧️📚",
  "Starting the day with a positive mindset and a warm cup of tea. ",
  "Dreaming of faraway places and endless adventures. ✈️",
  "Finding joy in the little moments that make life special. 💖",
  "Enjoying a peaceful moment of solitude in nature's embrace. 🌳",
  "Savoring the simple pleasure of homemade comfort food. 🍲",
  "Diving into a world of imagination with the turn of a page. 📚✨✨",
  "Spreading kindness like confetti wherever I go. 🎉",
  "Chasing sunsets and capturing memories along the way. 🌅📸",
  "Taking a stroll down memory lane and reminiscing on sweet moments. 🚶‍♂️💭"
];

// Function to create home posts
const createHomePosts = async ({ usersIds, postImageFileIds }) => {
  
  const homePostsInfo = []; // Array to store created posts

  // Calculate a date three days ago
  const fiveDaysAgo = new Date();
  fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);

  shuffleArray(postImageFileIds); // Shuffle the postImageFileIds array

  // Iterate over each post image file id
  for (const postImageFileId of postImageFileIds) {
    shuffleArray(usersIds); // Shuffle the usersIds array before each iteration
    
    // Generate a random creation date for the post
    const createdAt = faker.date.between(fiveDaysAgo, new Date());

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
      content: fakePostContent[Math.floor(Math.random() * fakeComments.length)],
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
  }
  return homePostsInfo
};

// Export the createHomePosts function
module.exports = createHomePosts;

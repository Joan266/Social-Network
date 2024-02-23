const mongoose = require('mongoose');
const fetch = require('node-fetch');
const faker = require('faker'); 
const bcrypt = require('bcrypt');
const User = require('./models/user');
const Post = require('./models/post');
const { MONGODB_URI } = require('./dotenv.js');

const generateFakeUser = () => {
  // Generate username with symbols
  let usernameWithSymbols = faker.internet.userName();

  // Remove symbols using regular expression
  const username = usernameWithSymbols.replace(/[^\w]/g, '');

  const email = faker.internet.email();
  const password = faker.internet.password();
  const bio = faker.lorem.sentence(); 
  // Generate birthdate between 1930 and 2015
  const minDate = new Date('1930-01-01'); 
  const maxDate = new Date('2015-01-01'); 
  const birthDate = faker.date.between(minDate, maxDate);
  const location = faker.address.country();

  return {
    username,
    bio,
    birthDate,
    email,
    location,
    password
  };
};

const configDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB"); // Log the name of the connected database
    const db = mongoose.connection;
    console.log('Connected to database:', db.name);
  } catch (error) {
    console.error("Error connecting to the DB:", error);
    process.exit(1); // Exit the process on a critical error
  }
};
configDB();

const connection = mongoose.connection;
let gfs;

connection.once('open', () => {
  gfs = new mongoose.mongo.GridFSBucket(connection.db);
});


const uploadImage = async (url) => {
  try {
    const response = await fetch(url);

    // Check if the response is successful
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    // Get the ID from the response headers
    const picsumID = response.headers.get('Picsum-ID');
    // Log or use the ID as needed
    console.log('Picsum ID:', picsumID);

    // Read the response body as Buffer
    const buffer = await response.buffer();

    // Check if the file is an image based on its MIME type
    if (!response.headers.get('content-type').startsWith('image/')) {
      throw new Error('Only image files are allowed');
    }

    // Generate an encrypted version of the original filename (replace 'file.originalname' with actual filename)
    const saltRounds = 7;
    const encryptedFilename = await bcrypt.hash(url, saltRounds);

    // Assuming 'gfs' is your GridFSBucket instance
    const uploadStream = gfs.openUploadStream(encryptedFilename, {
      chunkSizeBytes: 262144,
      metadata: { contentType: response.headers.get('content-type'), picsumID }
    });

    // Pipe the buffer data to the upload stream
    uploadStream.end(buffer);

    // Return the encrypted filename after upload
    return new Promise((resolve, reject) => {
      uploadStream.on('finish', () => {
        resolve({ encryptedFilename, picsumID });
      });
      uploadStream.on('error', (error) => {
        reject(error);
      });
    });
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    throw error; // Rethrow the error to handle it outside this function
  }
};


// Function to handle Gunzip stream
const gunzipStream = (stream) => {
  return new Promise((resolve, reject) => {
    let decompressedData = Buffer.alloc(0);
    stream.on('data', (chunk) => {
      decompressedData = Buffer.concat([decompressedData, chunk]);
    });
    stream.on('end', () => {
      resolve(decompressedData);
    });
    stream.on('error', (err) => {
      reject(err);
    });
  });
};

const uploadPostImages = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    // Decompress response body
    const decompressedData = await gunzipStream(response.body);
    console.log('Decompressed data:', decompressedData.toString('utf8'));

    // Use Promise.all() to upload images concurrently
    const uploadPromises = JSON.parse(decompressedData.toString('utf8')).map(async ({ download_url }) => {
      const { encryptedFilename: postImageFileId } = await uploadImage(download_url);
      return postImageFileId;
    });

    // Wait for all uploads to complete
    const postImageFileIds = await Promise.all(uploadPromises);
    return postImageFileIds;
  } catch (error) {
    console.error('There was a problem with uploading post images:', error);
    throw error; // Rethrow the error to handle it outside this function
  }
};


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

    const USERS_NUM = 20;
    const POSTS_NUM = 20;
    const POSTS_PAGE = 2;
    const profilepicUrl = "https://picsum.photos/200.webp";
    const bannerUrl = "https://picsum.photos/600/200.webp";
    const postsUrl = `https://picsum.photos/v2/list?page=${POSTS_PAGE}&limit=${POSTS_NUM}`;

    const postImageFileIds = await uploadPostImages(postsUrl);
    // Generate fake users
    const fakeUsers = [];

    for (let i = 0; i < USERS_NUM; i++) {
      const fakeUser = generateFakeUser();
      fakeUsers.push(fakeUser);
      console.log(fakeUser)
    }
    
    // Upload profile pictures and banner images
    const profilePicFilesInfo = [];
    const bannerFilesInfo = [];

    for (let i = 0; i < USERS_NUM; i++) {
      const { encryptedFilename: profilePicEncryptedFilename, picsumID: profilePicPicsumID } = await uploadImage(profilepicUrl);
      profilePicFilesInfo.push({ profilePicEncryptedFilename, profilePicPicsumID });

      const { encryptedFilename: bannerEncryptedFilename, picsumID: bannerPicsumID } = await uploadImage(bannerUrl);
      bannerFilesInfo.push({ bannerEncryptedFilename, bannerPicsumID });
    }

    // Create users
    const usersIds = [];

    
    for (let i = 0; i < USERS_NUM; i++) {
      const { password, email, username, ...rest } = fakeUsers[i];
      const user = await User.signup({ email, username, password:"1qa2ws3ed!Q" }); // Use faker to generate password
      const userDataUpdate = { ...rest };
      
      userDataUpdate.profilePicFileId = profilePicFilesInfo[i].profilePicEncryptedFilename;
      userDataUpdate.bannerFileId = bannerFilesInfo[i].bannerEncryptedFilename;

      const userUpdated = await User.findByIdAndUpdate(user._id, { ...userDataUpdate }, { new: true });
      usersIds.push(userUpdated._id);
    }

    // Shuffle function to shuffle the array
    function shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
    }
    shuffleArray(postImageFileIds)
    console.log(`postImageFileIds: ${postImageFileIds}`)
    
    console.log(`usersIds: ${usersIds}`)
    for (const postImageFileId of postImageFileIds) {
    // Shuffle the usersIds array before each iteration
    shuffleArray(usersIds);

    const randomNum = Math.floor(Math.random() * usersIds.length); //random number between min and max usersIds indices
    const userId = usersIds[randomNum];
    const likes = usersIds.slice(0, randomNum); // Slice the shuffled array to get random user IDs
    console.log(`postImageFileId:${postImageFileId}, randomNume: ${randomNum}, userId:${userId},likes:${likes}`)
    const post = await Post.create({
      _id: new mongoose.Types.ObjectId(),
      postImageFileId,
      likesCount: likes.length,
      likes,
      user: userId,
    });
    console.log(`post:${post}`)
    const user = await User.findByIdAndUpdate(
      userId,
      { $push: { posts: post._id } }
      , { new: true }
    );
    console.log(`user:${user}`)
  }

    console.log(`Seed data successfully added!`);
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    mongoose.disconnect();
  }
};

seedUsers();

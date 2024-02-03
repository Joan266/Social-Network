const mongoose = require('mongoose');
const casual = require('casual');
const User = require('./models/user'); 
const { MONGODB_URI } = require('./dotenv.js');

const configDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");// Log the name of the connected database
    const db = mongoose.connection;
    console.log('Connected to database:', db.name);
  } catch (error) {
    console.error("Error connecting to the DB:", error);
    process.exit(1); // Exit the process on a critical error
  }
};
configDB();

const seedUsers = async () => {
  try {
    let count = 0;
    for (let i = 1; i <= 200; i++) {
      const casual_email = casual.email;
      const [email_0, email_1] = casual_email.split(/@/);
      
      const randomIndex = Math.floor(Math.random() * 2);
      const username = email_0.split(/[._]/)[randomIndex];
      const email = `${email_0.replace(/[._]/g, '')}@${email_1}`;
      const password = 'passworD123!';
      const existingUser = await User.findOne({ $or: [ { email },{ username }] });
      if(existingUser) continue;
      const user = await User.signup({ email, username, password });
      count++;
    
      if (user) {
        console.log(`User: ${user.username}, email: ${user.email} added.`);
      }
    }
    for (let i = 1; i <= 300; i++) {
      const casual_username = casual.username;
      
      const randomIndex = Math.floor(Math.random() * 2);
      const username =casual_username.split(/[._]/)[randomIndex];
      const email = `${username.toLocaleLowerCase()}@gmail.com`;
      const password = 'passworD123!';
      const existingUser = await User.findOne({ $or: [ { email },{ username }] });
      if(existingUser) continue;
      const user = await User.signup({ email, username, password });
      count++;
      if (user) {
        console.log(`User: ${user.username}, email: ${user.email} added.`);
      }
    }

    console.log(`Seed data successfully added! count: ${count}`);
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    mongoose.disconnect();
  }
};

seedUsers();

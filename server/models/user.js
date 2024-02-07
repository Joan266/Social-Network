const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

function isUsername(username) {
  const minUsernameLength = 3;
  const maxUsernameLength = 20; 

  const usernameRegex = /^[a-zA-Z0-9_]+$/; // Allows letters, numbers, and underscores

  const isLengthValid = username.length >= minUsernameLength && username.length <= maxUsernameLength;

  return isLengthValid && usernameRegex.test(username);
}

const Schema = mongoose.Schema

const userSchema = new Schema(
  {
    _id: Schema.Types.ObjectId,
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    privacyStatus: {
      type:Boolean,
      default:false,
    },
    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      }
    ],
    following: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      }
    ],
    followersCount: {
      type: Number,
      default: 0
    },
    followingCount: {
      type: Number,
      default: 0
    },
    posts: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Post',
      }
    ],
  },
  {
    timestamps: { createdAt: true, updatedAt: false }
  }
);

userSchema.statics.signup = async function ({ email, password, username }) {
  if (!email || !password || !username) {
      throw Error('All fields must be filled');
  }
  if (!validator.isEmail(email)) {
      throw Error('Email not valid');
  }
  if (!validator.isStrongPassword(password)) {
      throw Error('Password not strong enough');
  }
  if (!isUsername(username)) {
      throw Error('Username not valid');
  }

  const existingUser = await this.findOne({ $or: [{ email }, { username }] });

  if (existingUser) {
      if (existingUser.email === email) {
          throw Error('Email already in use');
      } else {
          throw Error('Username already in use');
      }
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const user = await this.create({_id: new mongoose.Types.ObjectId(), email, password: hash, username });

  return user;
};

userSchema.statics.login = async function ({ emailOrUsername, password }) {
  if (!emailOrUsername || !password) {
      throw Error('All fields must be filled');
  }

  // Check if the provided value is an email or a username
  const isEmail = validator.isEmail(emailOrUsername);

  let user;
  if (isEmail) {
    user = await this.findOne({ email: emailOrUsername });
  } else {
    user = await this.findOne({ username: emailOrUsername });
  }
  if (!user) {
    throw Error('Incorrect email or username or password');
  }
  const match = await bcrypt.compare(password, user.password);

  if (!match) {
      throw Error('Incorrect email or username or password');
  }

  return user;
};



module.exports = mongoose.model('User', userSchema);

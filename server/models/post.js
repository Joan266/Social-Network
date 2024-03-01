const mongoose = require('mongoose');

const Schema = mongoose.Schema

const postSchema = new Schema(
  {
    _id: Schema.Types.ObjectId,
    reply: {
      _id : {type: Schema.Types.ObjectId,
      ref: 'Post',},
      username: { type: String },
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    content: {
      type: String,
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      }
    ],
    likesCount: {
      type: Number,
      default:0,
    },
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Post',
      }
    ],
    commentsCount: {
      type: Number,
      default:0,
    },
    postImageFileId: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }
);

module.exports = mongoose.model('Post', postSchema);
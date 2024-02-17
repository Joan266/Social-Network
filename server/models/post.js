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
    file: {
      type:String,
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
    file: {
      type: Schema.Types.ObjectId,
      ref: 'File',
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false }
  }
);

module.exports = mongoose.model('Post', postSchema);
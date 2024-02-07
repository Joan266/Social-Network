const mongoose = require('mongoose');

const Schema = mongoose.Schema

const postSchema = new Schema(
  {
    _id: Schema.Types.ObjectId,
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required:true,
    },
    content: {
      type: String,
      required: true,
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
    }
  },
  {
    timestamps: { createdAt: true, updatedAt: false }
  }
);

module.exports = mongoose.model('Post', postSchema);
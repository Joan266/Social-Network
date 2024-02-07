const mongoose = require('mongoose');
const Post = require('../models/post');
const User = require('../models/user');

module.exports = postController =  {
  create: async (req, res) => {
    const {content, userId} = req.body
    console.log(req.body)
    try {
      const post = await Post.create({ _id: new mongoose.Types.ObjectId(), content});
      await User.findByIdAndUpdate(
        userId,
        { $push: { posts: post._id } }
      );
      post.user = userId;
      await post.save();
      if(post){
        res.status(200).json(post._id)
      }else {
        console.log(`Post create operation failed`)
        res.status(404).json({ error: "Post create operation failed" })
      }
    } catch (error) {
      console.log(`Error: ${error}`)
      res.status(400).json({
        error: 'Bad Request',
      })
    }
  },
  fetchPostData: async (req, res) => {
    try {
      const { query } = req.query;

      // Use Mongoose to search for post
      const post = await Post.findOne({ _id: query })
      .select('-likes -_id -__v')
      .populate({ path: 'user', select: 'username -_id' })
      .exec()
      const { user, ...rest } = post.toObject(); 
      const modifiedPost = { ...rest, ...user };
      console.log(modifiedPost)
      if (modifiedPost) {
        res.status(200).json(modifiedPost);
      } else {
        res.status(404).json({ error: "Post not found" });
      }
    } catch (error) {
      console.error("Error getting user:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}
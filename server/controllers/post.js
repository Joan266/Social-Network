const mongoose = require('mongoose');
const Post = require('../models/post');
const User = require('../models/user');

module.exports = postController =  {
  create: async (req, res) => {
    const {content, userId} = req.body
    console.log(req.body)
    try {
      const user = await User.findById(userId).select('username');
      const post = await Post.create({ _id: new mongoose.Types.ObjectId(), content, user:userId});
      const postData = {
        username: user.username,
        content: post.content, 
        likesCount: post.likesCount, 
        _id: post._id,
        createdAt:post.createdAt,
      };
      if(post){
        console.log(`newPost: ${post}, user:${user}`)
        res.status(200).json(postData)
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
}
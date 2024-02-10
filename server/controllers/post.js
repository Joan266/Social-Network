const mongoose = require('mongoose');
const Post = require('../models/post');
const User = require('../models/user');

module.exports = postController =  {
  create: async (req, res) => {
    const {content, userId, postId} = req.body
    console.log(req.body)
    try {
      const post = await Post.create({ _id: new mongoose.Types.ObjectId(), content});
      const user = await User.findByIdAndUpdate(
        userId,
        { $push: { posts: post._id } }
      );
      if(postId){
        post.reply._id = postId
        post.reply.username = user.username
        await Post.findByIdAndUpdate(
          postId,
          { $push: { comments: post._id }, $inc: { commentsCount: 1 } },
        );
      }
      post.user = userId;
      await post.save();
      if(post){
        res.status(200).json({_id: post._id})
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
      .select('-likes -__v')
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
  },
  likePost: async (req, res) => {
    try {
      const { userId, postId } = req.body;

      // Use Mongoose to search for post
      const post = await Post.findOneAndUpdate(
        { _id: postId },
        { $push: { likes: userId }, $inc: { likesCount: 1 } },
        { new: true }
      );
      
      if (post) {
        console.log(post);
        res.status(200).json();
      } else {
        res.status(404).json({ error: "Post not found" });
      }
    } catch (error) {
      console.error("Error liking post:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  unlikePost: async (req, res) => {
    try {
      const { postId, userId } = req.body;

      // Use Mongoose to search for post
      const post = await Post.findOneAndUpdate(
        { _id:postId },
        { $pull: { likes: userId }, $inc: { likesCount: -1 } },
        { new: true }
      );
      if (post) {
        console.log(post);
        res.status(200).json();
      } else {
        res.status(404).json({ error: "Post not found" });
      }
    } catch (error) {
      console.error("Error unliking post:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  isLikingPost: async (req, res) => {
    try {
      const { userId, postId } = req.body;
      
      // Use Mongoose to search for post
      const isLiking = await Post.findOne({ _id:postId, likes: userId });

      if (isLiking) {
        res.status(200).json(true);
      } else {
        res.status(200).json(false);
      }
    } catch (error) {
      console.error("Error getting post:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  homePosts: async (req, res) => {
    try {
        const { userId } = req.query;
        // Use Mongoose to search for posts of users with privacyStatus set to false
        const posts = await Post.find()
          .or([
              { 'user.following': userId }, // Posts from users followed by userId
              { 'user.privacyStatus': { $exists: false } } // Posts from users with no privacyStatus
          ])
          .sort({ createdAt: -1 }) // Sort posts by createdAt in descending order
          .select('_id') // Select only the _id field of the posts

        // Check if posts were found
        if (posts.length > 0) {
            console.log(posts);
            // Send the retrieved posts in the response
            res.status(200).json(posts);
        } else {
            // Send a 404 error if no posts were found
            res.status(404).json({ error: "User posts not found" });
        }
    } catch (error) {
        // Handle errors and send a 500 error response
        console.error("Error getting home posts:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
},
postReplies: async (req, res) => {
  try {
      const { postId } = req.query;
      // Use Mongoose to search for posts of users with privacyStatus set to false
      const post = await Post.findById(postId)
      .select('comments -_id')
      .populate({ path: 'comments', select: '_id' })
      .exec()
      console.log(postId)
      // Check if posts were found
      if (post && post.comments) {
          console.log(post.comments);
          // Send the retrieved posts in the response
          res.status(200).json(post.comments);
      } else {
          // Send a 404 error if no posts were found
          res.status(404).json({ error: "Post replies not found" });
      }
  } catch (error) {
      // Handle errors and send a 500 error response
      console.error("Error getting post replies:", error);
      res.status(500).json({ error: "Internal Server Error" });
  }
},
}
const mongoose = require('mongoose');
const Post = require('../models/post');
const User = require('../models/user');

module.exports = postController =  {
  create: async (req, res) => {
    const {content, userId, postId, postImageFileId } = req.body
    console.log(req.body)
    try {
      const post = await Post.create({ _id: new mongoose.Types.ObjectId(), content});
      await User.findByIdAndUpdate(
        userId,
        { $push: { posts: post._id } }
      );
      if(postId){
        post.parentPost = postId
        await Post.findByIdAndUpdate(
          postId,
          { $push: { comments: post._id }, $inc: { commentsCount: 1 } },
        );
      }
      post.user = userId;
      post.postImageFileId = postImageFileId || null;
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
  delete: async (req, res) => {
    const { postId } = req.body
    try {
        const post = await Post.findByIdAndDelete(postId); 
        console.log(post);
        if (post) {
            console.log(`Post: ${postId} deleted successfully`);
            res.status(200).json({ message: `Post ${postId} deleted successfully`,postImageFileId: post.postImageFileId }); // Send success message
        } else {
            console.log(`Post delete operation failed`);
            res.status(404).json({ error: "Post not found" });
        }
    } catch (error) {
        console.log(`Error: ${error}`);
        res.status(500).json({
            error: 'Internal Server Error',
        }); // Send 500 for any unexpected errors
    }
},
  fetchPostData: async (req, res) => {
    try {
      const { postId } = req.query;

      // Use Mongoose to search for post
      const post = await Post.findById(postId)
        .select('-likes -__v -comments -postImageFileId')
        .populate({ path: 'user', select: 'username -_id' })
        .populate({ path: 'parentPost', select: 'user' , populate: { path: 'user', select: 'username' } })
        .exec();
      
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }
      console.log(post)
      const { parentPost, user, ...rest } = post.toObject(); 
      const modifiedPost = { ...rest, ...user, parentPostUsername: parentPost ? parentPost.user.username : null};

      res.status(200).json(modifiedPost);
    } catch (error) {
      console.error("Error getting post:", error);
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
        const { userId, cursor, lastTimestamp } = req.query;
        if(!cursor){
          res.status(404).json({ error: "Cursor required" });
        }
        const pageSize = 10; 
        const skip = (parseInt(cursor) - 1) * pageSize; // Parse to integer
        const query = {};

        if (lastTimestamp) { // Check for the presence of lastTimestamp
            query.createdAt = { $lt: new Date(parseInt(lastTimestamp)) }; // Parse to Date
        }

        // Use Mongoose to search for posts of users with privacyStatus set to false
        const posts = await Post
          .find({
            user: { $ne: userId }, // Exclude posts belonging to userId
            $or: [
              { 'user.following': userId }, // Posts from users followed by userId
              { 'user.privacyStatus': { $exists: false } } // Posts from users with no privacyStatus
            ],
            parentPost: undefined // Filter out replies (where parentPost is undefined)
          })
          .populate({ path: 'user', select: 'username' })
          .sort({ createdAt: -1 }) // Sort posts by createdAt in descending order
          .select('_id createdAt user') // Select only the _id field of the posts
          .skip(skip)
          .limit(pageSize);
        // Check if posts were found
        const timestamp = !lastTimestamp ? posts[0]?.createdAt : lastTimestamp
        // Send the retrieved posts in the response
        res.status(200).json({ posts: posts.length !==0 ? posts : [], timestamp });

    } catch (error) {
        // Handle errors and send a 500 error response
        console.error("Error getting home posts:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
},
postReplies: async (req, res) => {
  try {
      const { postId } = req.query;
      console.log(postId)
      // Use Mongoose to search for posts of users with privacyStatus set to false
      const post = await Post.findById(postId)
      .select('comments')
      .populate({
        path: 'comments',
        select: 'user',
        populate: {
          path: 'user',
          select: 'username'
        }
      })
      .exec()
      
      console.log(post)
      res.status(200).json({ posts: post ? post.comments : [], error: !post });
  } catch (error) {
      // Handle errors and send a 500 error response
      console.error("Error getting post replies:", error);
      res.status(500).json({ error: "Internal Server Error" });
  }
},
}
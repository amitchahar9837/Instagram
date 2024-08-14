import Post from "../models/post.model.js";
import User from '../models/user.model.js'
import { errorHandler } from "../utils/error.js";

export const getposts = async (req, res, next) => {
      try {
            const posts = await Post.find({}).populate('postedBy', '_id username name dp').populate('comments.postedBy', '_id name username dp').sort('-createdAt');
            res.status(200).json(posts);
      } catch (error) {
            next(error);
      }
}
export const getUserPosts = async (req, res, next) => {
      try {
            const posts = await Post.find({ postedBy: req.params.id }).populate('postedBy', '_id name username dp').populate('comments.postedBy', '_id name username dp').sort('-createdAt');
            res.status(200).json(posts);
      } catch (error) {
            next(error);
      }
}
export const getMyPosts = async (req, res, next) => {
      try {
            const posts = await Post.find({ postedBy: req.user.id }).populate('postedBy', '_id username name dp').populate('comments.postedBy', '_id username name dp').sort('-createdAt');
            res.status(200).json(posts);
      } catch (error) {
            next(error);
      }
}

export const followingUserPost = async (req, res, next) => {
      try {
            const user = await User.findById(req.user.id);
            const posts = await Post.find({ postedBy: { $in: user.following } }).populate('postedBy', '_id username name dp').populate('comments.postedBy', '_id name username dp').sort('-createdAt');

            res.status(200).json(posts);

      } catch (error) {
            next(error)
      }

}

export const createPost = async (req, res, next) => {
      const { title, body, picture } = req.body;

      if (!picture) {
            return next(errorHandler(400, "Please provide post picture"));
      }
      const newPost = new Post({
            title,
            body,
            picture,
            postedBy: req.user.id
      })
      try {
            const savedPost = await newPost.save();
            res.status(201).json(savedPost);
      } catch (error) {
            next(error);
      }
}

export const likePost = async (req, res, next) => {
      try {
            const postData = await Post.findById(req.params.postId);
            if (!postData) {
                  return next(errorHandler(404, "Post not found!"));
            }
            const userIndex = postData.likes.indexOf(req.user.id);
            if (userIndex === -1) {
                  const post = await Post.findByIdAndUpdate(req.params.postId, { $push: { likes: req.user.id } }, { new: true }).populate('postedBy', '_id name username dp').populate('comments.postedBy', '_id username name dp');
                  return res.status(200).json(post);
            } else {
                  const post = await Post.findByIdAndUpdate(req.params.postId, { $pull: { likes: req.user.id } }, { new: true }).populate('postedBy', '_id name username dp').populate('comments.postedBy', '_id username name');
                  return res.status(200).json(post);
            }
      } catch (error) {
            next(error);
      }
}

export const createComment = async (req, res, next) => {
      const comment = {
            text: req.body.text,
            postedBy: req.user.id
      }

      if (!comment.text) {
            return next(errorHandler(400, "Please provide comment"));
      }

      try {
            const postComment = await Post.findByIdAndUpdate(req.params.postId, { $push: { comments: comment } }, { new: true }).populate('postedBy', '_id username name dp').populate('comments.postedBy', '_id username name dp');
            res.status(200).json(postComment);
      } catch (error) {
            next(error)
      }
}

export const deletePost = async (req, res, next) => {
      try {
            const post = await Post.findById(req.params.postId);
            if (!post) {
                  return next(errorHandler(404, "Post not found!"));
            }
            if (post.postedBy.toString() !== req.user.id) {
                  return next(errorHandler(401, "You are not authorized to delete the post!"));
            }
            await post.deleteOne();
            res.json("Post deleted successfully")
      } catch (error) {
            next(error);
      }
}

export const likeList = async (req, res, next) => {
      try {
            const post = await Post.findById(req.params.postId);
            if (!post) {
                  return next(errorHandler(404, "Post not found"));
            }
            const user = await User.find({ _id: post.likes }).select('_id username name dp email');
            res.status(200).json(user);
      } catch (error) {
            next(error)
      }
}

export const editComment = async (req, res, next) => {
      const { postId, commentId } = req.params;
      const { text } = req.body;
      try {
            // Find the post
            const post = await Post.findById(postId);

            if (!post) {
                  return next(errorHandler(404, "Post not found"))
            }

            // Find the comment and update
            const comment = post.comments.id(commentId);

            if (!comment) {
                  return next(errorHandler(404, "Comment not found"));
            }

            comment.text = text;
            // Save the updated post
            await post.save();
            res.status(200).json("Comment updated successfully");
      } catch (error) {
            next(error)
      }
}
export const deleteComment = async (req, res, next) => {
      const { postId, commentId } = req.params;
      try {
            // Find the post by ID
            const post = await Post.findById(postId);

            if (!post) {
                  return res.status(404).json({ message: 'Post not found' });
            }

            // Check if the comment exists in the comments array
            const commentIndex = post.comments.findIndex(c => c._id.toString() === commentId);

            if (commentIndex === -1) {
                  return res.status(404).json({ message: 'Comment not found' });
            }

            // Remove the comment from the array
            post.comments.splice(commentIndex, 1);

            // Save the updated post
            await post.save();
            res.status(200).json("Comment deleted successfully");
      } catch (error) {
            next(error)
      }
}
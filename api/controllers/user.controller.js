import Post from "../models/post.model.js";
import User from "../models/user.model.js"
import { errorHandler } from "../utils/error.js";
import bcryptjs from 'bcryptjs';

export const getUser = async (req, res, next) => {
      const user = await User.findById(req.params.id).select("-password");
      if (!user) {
            return next(errorHandler(404, "User not found!"));
      }
      const posts = await Post.find({ postedBy: user.id }).populate('comments.postedBy', '_id name username').sort('-createdAt');

      res.status(200).json({ user, posts });
}

export const followUser = async (req, res, next) => {
      try {
            const user = await User.findById(req.params.userId);
            const userIndex = user.followers.indexOf(req.user.id);
            if (userIndex === -1) {
                  const followedUser = await User.findByIdAndUpdate(req.params.userId, { $push: { followers: req.user.id } }, { new: true }).select("-password");

                  const currentUser = await User.findByIdAndUpdate(req.user.id, { $push: { following: req.params.userId } }, { new: true }).select("-password");

                  return res.status(200).json({ followedUser, currentUser });
            }
            else {
                  const followedUser = await User.findByIdAndUpdate(req.params.userId, { $pull: { followers: req.user.id } }, { new: true }).select("-password");

                  const currentUser = await User.findByIdAndUpdate(req.user.id, { $pull: { following: req.params.userId } }, { new: true }).select("-password");
                  return res.status(200).json({ followedUser, currentUser });
            }
      } catch (error) {
            next(error);
      }
}

export const followerList = async (req, res, next) => {
      try {
            const userData = await User.findOne({_id: req.params.userId});
            const users = await User.find({ _id: userData.followers }).select('id name dp username email');
            return res.status(200).json(users)
      } catch (error) {
            next(error)
      }
}
export const followingList = async (req, res, next) => {
      try {
            const userData = await User.findOne({_id: req.params.userId});
            const users = await User.find({ _id: userData.following }).select('id name dp username email');
            return res.status(200).json(users)
      } catch (error) {
            next(error)
      }
}
export const updateUser = async (req, res, next) => {
      if (req.user.id !== req.params.userId) {
            return next(errorHandler(403, 'You are not allowed to update the user'))
      }
      if (req.body.password) {
            if (req.body.password.length < 6) {
                  return next(errorHandler(400, 'Password must be at least 6 characters'))
            }
            if (req.body.username) {
                  if (req.body.username.length < 7 || req.body.username.length > 20) {
                        return next(errorHandler(400, 'username must be between 7 and 20 characters'))
                  }
                  if (req.body.username.includes(' ')) {
                        return next(errorHandler(400, 'username cannot contain spaces'))
                  }
                  if (req.body.username !== req.body.username.toLowerCase()) {
                        return next(errorHandler(400, 'username must be lowercase'))
                  }
                  if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
                        return next(errorHandler(400, 'username can only contain letters and numbers'))
                  }
            }
            req.body.password = bcryptjs.hashSync(req.body.password, 10);
      }
      try {
            const updateUser = await User.findByIdAndUpdate(req.params.userId, {
                  $set: {
                        username: req.body.username,
                        name: req.body.name,
                        email: req.body.email,
                        dp: req.body.dp,
                        password: req.body.password,
                  }
            }, { new: true })

            const { password, ...rest } = updateUser._doc;
            res.status(200).json(rest);
      } catch (error) {
            next(errorHandler(error));
      }
}

export const searchUser = async (req, res, next) => {
      const startIndex = parseInt(req.query.startIndex) || 0;
      const limit = parseInt(req, query.limit) || 0;
      try {
            const user = await User.find({
                  ...(req.query.search && { $or: [{ name: { $regex: req.query.search, $options: 'i' } }, { username: { $regex: req.query.search, $options: 'i' } }] })
            }).populate("following", "_id name username dp").populate("follower", "_id name username dp").sort("-createdAt").skip(startIndex).limit(limit);
      } catch (error) {
            next(error)
      }
}

export const signout = (req, res, next) => {
      try {
            res.clearCookie('access_token').status(200).json("User has been signed out")
      } catch (error) {
            next(error)
      }
}

export const deleteUser = async (req, res, next) => {
      if (req.user.id !== req.params.userId) {
            return next(errorHandler(403, "You are not allowed to delete account"))
      }
      try {
            await User.findByIdAndDelete(req.params.userId);
            await Post.deleteMany({ postedBy: req.params.userId });
            res.status(200).json("Account has been deleted")
      } catch (error) {
            next(error);
      }
}


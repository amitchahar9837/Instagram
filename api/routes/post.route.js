import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { createComment, createPost, deleteComment, deletePost, editComment, followingUserPost, getMyPosts, getposts, getUserPosts, likeList, likePost } from '../controllers/post.controller.js';


const router = express.Router();

router.get('/getposts',getposts);
router.get('/getuserposts/:id',verifyToken, getUserPosts)
router.get('/myposts',verifyToken,getMyPosts);
router.get('/followingUser-post',verifyToken,followingUserPost);
router.post('/create-post',verifyToken, createPost);
router.put('/likepost/:postId',verifyToken,likePost);
router.put('/comment/:postId', verifyToken, createComment);
router.put('/editcomment/:postId/:commentId',verifyToken,editComment);
router.delete('/deletecomment/:postId/:commentId',verifyToken,deleteComment);
router.delete('/delete-post/:postId', verifyToken, deletePost);
router.get('/likelist/:postId',likeList)

export default router
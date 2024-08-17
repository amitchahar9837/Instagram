import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import {  followerList, followingList, followUser, getUser, removeFollower, searchFollowingUser, searchUser, signout, updateUser } from '../controllers/user.controller.js';


const router = express.Router();

router.get('/getuser/:id',verifyToken,getUser);
router.get('/searchuser',verifyToken,searchUser);
router.get('/searchfollowinguser',verifyToken,searchFollowingUser);
router.put('/update/:userId', verifyToken, updateUser);
router.put('/removefollower/:userId',verifyToken,removeFollower)
router.put('/follow/:userId',verifyToken,followUser)
router.post('/signout',signout);
router.get('/followerlist/:userId',verifyToken,followerList)
router.get('/followinglist/:userId',verifyToken,followingList)

export default router
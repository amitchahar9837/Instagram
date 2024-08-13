import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { deleteUser, followerList, followingList, followUser, getUser, signout, updateUser } from '../controllers/user.controller.js';


const router = express.Router();

router.get('/getuser/:id',verifyToken,getUser);
router.put('/update/:userId', verifyToken, updateUser);
router.delete('/delete/:userId',verifyToken, deleteUser);
router.put('/follow/:userId',verifyToken,followUser)
router.post('/signout',signout);
router.get('/followerlist/:userId',verifyToken,followerList)
router.get('/followinglist/:userId',verifyToken,followingList)

export default router
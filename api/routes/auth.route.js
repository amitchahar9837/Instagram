import express from 'express';
import { forgotPassword, resetPassword, signin, signup } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/signup',signup)
router.post('/signin',signin)
router.put('/reset-password',resetPassword)
router.put('/forgot-password',forgotPassword)

export default router
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import randomstring from 'randomstring';
import { sendResetPasswordMail } from "../utils/sendMail.js";
export const signup = async (req, res, next) => {
      const { username, name, email, password, dp } = req.body;

      if (!name || !username || !email || !password) {
            return next(errorHandler(400, "All fields are required!"));
      }

      if (password.length < 6) {
            return next(errorHandler(400, 'Password must be at least 6 characters'))
      }
      if (username) {
            if (username.length < 7 || username.length > 20) {
                  return next(errorHandler(400, 'username must be between 7 and 20 characters'))
            }
            if (username.includes(' ')) {
                  return next(errorHandler(400, 'username cannot contain spaces'))
            }
            if (username !== username.toLowerCase()) {
                  return next(errorHandler(400, 'username must be lowercase'))
            }
            if (!username.match(/^[a-zA-Z0-9._-]+$/)) {
                  return next(errorHandler(400, 'username can only contain letters and numbers and special characters(. - _)'))
            }
      }

      const exist = await User.findOne({ username });

      if (exist) {
            return next(errorHandler(406, "Username already exist!"));
      }
      const existEmail = await User.findOne({ email });
      if (existEmail) {
            return next(errorHandler(406, "Email already exist!"));
      }
      const hashedpassword = bcryptjs.hashSync(password,10);
      const newUser = new User({
            name,
            username,
            email,
            password: hashedpassword,
            dp,
      });

      try {
            await newUser.save();
            res.status(201).json({message:"Signup Successfully"});
      } catch (error) {
            next(error)
      }
}

export const signin = async (req, res, next) => {
      const { username, password } = req.body;

      if(!username || !password || username === '' || password === ''){
            return next(errorHandler(400, "All fields are required!"));
      }

      try {
            const validUser = await User.findOne({ username });
            if (!validUser) {
                  return next(errorHandler(404, "User not found!"));
            }
            const validPassword = bcryptjs.compareSync(password, validUser.password);
            if (!validPassword) {
                  return next(errorHandler(404, "Invalid username or password!"));
            }
            const user = await User.findOne({ username }).select("-password");
            const token = jwt.sign({
                  id:user._id,
            }, process.env.JWT_SECRET, {
                  expiresIn: 60 * 60 * 24
            });
            res.status(200).cookie('access_token', token, {
                  httpOnly: true
            }).json(user);

      } catch (error) {
            next(error)
      }
}

export const resetPassword = async (req,res,next) => {
      const {password, token} = req.body;

      if(!password || password === ''){
            return next(errorHandler(400, "All fields are required!"));
      }
      try {
            const data = await User.findOne({token});

            if(!data){
                  return next(errorHandler(404, "Token has been expired or wrong token"));
            }

            const newPassword = bcryptjs.hashSync(password,10);
            await User.findOneAndUpdate({_id:data._id},{password:newPassword,token:""});
            res.status(200).json({message:"Password reset successfully"});

      } catch (error) {
            next(error)
      }

}

export const forgotPassword = async(req,res,next) =>{
      const {email } = req.body;
      try {
            const user = await User.findOne({email});

            if(!user){
                  return next(errorHandler(404, "User not found!"));
            }
            
            const token = randomstring.generate({
                  length:6,
                  charset: 'numeric'
            });
            await User.updateOne({email},{token});
            await sendResetPasswordMail(user.name, user.email, token);
            res.status(200).json({message:"Reset token has been sent to your email"});
      } catch (error) {
            next(error);
      }
}
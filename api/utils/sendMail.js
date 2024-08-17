import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();
const emailUser = process.env.emailUser;
const emailPassword = process.env.emailPassword;



export const sendResetPasswordMail = (name, email, token) => {
      try {
            let transporter = nodemailer.createTransport({
                  service: 'gmail',
                  auth: {
                      user : emailUser,
                      pass: emailPassword,
                  }
              });
      
              let mailOptions = {
                  from: emailUser,
                  to: email,
                  subject: 'Instagram Password Reset ',
                  html: "<p>Hello " + name + ", here is your token <h2>" + token + "</h2> to reset your password. Use it to reset password </p>"
              };

              transporter.sendMail(mailOptions, (error, info) => {
                  if (error) {
                      console.log(error.message)
                  }
              })
      } catch (error) {
            next(error)
      }
}
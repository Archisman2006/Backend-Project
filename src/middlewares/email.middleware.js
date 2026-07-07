import nodemailer from 'nodemailer'
import dotenv from 'dotenv';
import { Verification_Email_Template, Welcome_Email_Template,reset_password_email_template } from '../utils/emailTemplate.js';
dotenv.config();
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // use STARTTLS (upgrade connection to TLS after connecting)
    auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    },
});
export const sendVerificationCode=async(email,code)=>{
    try {
        const info=await transporter.sendMail({
    from: `"Archisman Das" <${process.env.SMTP_USER}>`, // sender address
    to: email, // list of recipients
    subject: "verify your email", // subject line
    text: "please verify email.", // plain text body
    html: Verification_Email_Template.replace("{verificationCode}",code), // HTML body
    })
    //console.log(info);
    }
    catch(error){
        console.log(error);
    }
}
export const sendWelcomeEmail=async(email,name)=>{
    try{
        const info=await transporter.sendMail({
    from: `"Archisman Das" <${process.env.SMTP_USER}>`, // sender address
    to: email, // list of recipients
    subject: "Welcome", // subject line
    text: "Email verification completed.", // plain text body
    html: Welcome_Email_Template.replace('{name}',name), // HTML body
    })
    }
    catch(error){
        console.log(error);
    }
}
export const sendResetPasswordLink=async(email,token)=>{
    try {
        await transporter.sendMail({
            from:`"Archisman Das" <${process.env.SMTP_USER}>`,
            to:email,
            subject:"Password Reset Request",
            html:reset_password_email_template.replaceAll('{link}',`http://localhost:5173/reset-password/${token}`)
        })
    } catch (error) {
        console.log(error);
    }
}

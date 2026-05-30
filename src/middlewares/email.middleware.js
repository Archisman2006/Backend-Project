import nodemailer from 'nodemailer'
import dotenv from 'dotenv';
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
// const sendEmail=async()=>{
//     try {
//         const info=await transporter.sendMail({
//     from: `"Archisman Das" <${process.env.SMTP_USER}>`, // sender address
//     to: process.env.SMTP_USER, // list of recipients
//     subject: "Hello", // subject line
//     text: "Hello world?", // plain text body
//     html: "<b>Hello world?</b>", // HTML body
// });
//     console.log(info);
//     } catch (error) {
//         console.log(error);
//     }
// }
// sendEmail();
export const sendVerificationCode=async(email,code)=>{
    try {
        const info=await transporter.sendMail({
    from: `"Archisman Das" <${process.env.SMTP_USER}>`, // sender address
    to: email, // list of recipients
    subject: "verify your email", // subject line
    text: "please verify email.", // plain text body
    html: code, // HTML body
    })
    //console.log(info);
    }
    catch(error){
        console.log(error);
    }
}

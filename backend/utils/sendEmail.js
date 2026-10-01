import dotenv from "dotenv";
dotenv.config();

import { Resend } from "resend";

// import dns from "dns";
// dns.setDefaultResultOrder("ipv4first");

// import nodemailer from 'nodemailer'

console.log("EMAIL_USER =", process.env.EMAIL_USER);
console.log("EMAIL_PASS exists =",process.env.EMAIL_PASS);

//for development use this code
// const transporter=nodemailer.createTransport({
//     host: "smtp.gmail.com",
//     port: 587,
//     secure: false,
//     auth:{
//         user:process.env.EMAIL_USER,
//         pass:process.env.EMAIL_PASS
//     }
// })

// transporter.verify((error, success) => {
//   if (error) {
//     console.log("VERIFY ERROR:", error);
//   } else {
//     console.log("SMTP READY");
//   }
// });

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendOTPEmail=async(email,otp)=>{
    // for development use this comment code
    // await transporter.sendMail({
    //     from:process.env.EMAIL_USER,
    //     to:email,
    //     subject:'Email verification OTP',
    //     html:`
    //     <h2>MeetSphere Verification</h2>
    //     <h3>Your OTP is: ${otp}</h3>
    //      <p>Valid for 5 minutes.</p>
    //     `
    // })

    // for production use following Resend API
    try {
    const data = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "MeetSphere Email Verification",
      html: `
        <h2>MeetSphere Verification</h2>
        <h3>Your OTP is: ${otp}</h3>
        <p>This OTP is valid for 5 minutes.</p>
      `,
    });

    console.log("Email Sent:", data);
  } catch (error) {
    console.log("Resend Error:", error);
    throw error;
  }
}
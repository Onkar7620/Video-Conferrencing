import nodemailer from 'nodemailer'

const transporter=nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS
    }
})

export const sendOTPEmail=async(email,otp)=>{
    await transporter.sendMail({
        from:process.env.EMAIL_USER,
        to:email,
        subject:'Email verification OTP',
        html:`
        <h2>MeetSphere Verification</h2>
        <h3>Your OTP is: ${otp}</h3>
         <p>Valid for 5 minutes.</p>
        `
    })
}
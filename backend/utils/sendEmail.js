import nodemailer from 'nodemailer'

console.log("EMAIL_USER =", process.env.EMAIL_USER);
console.log("EMAIL_PASS exists =", !!process.env.EMAIL_PASS);

const transporter=nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS
    }
})

transporter.verify((error, success) => {
  if (error) {
    console.log("VERIFY ERROR:", error);
  } else {
    console.log("SMTP READY");
  }
});

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
import generateWebToken from "../utils/generateToken.js";
import bcrypt from "bcryptjs";
import User from "../models/user.js";
import cookieParser from "cookie-parser";

import Otp from "../models/Otp.js"
import { sendOTPEmail } from "../utils/sendEmail.js";
import { OAuth2Client } from "google-auth-library";

const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID
);

export const sendOtp=async(req,res)=>{
    try{
        const {email}=req.body

        const otp=Math.floor(
            100000+Math.random()*900000
        ).toString();

        await Otp.deleteMany({email})

        await Otp.create({
            email:email,
            otp:otp,
            expiresAt:new Date(
                Date.now()+5*60*1000
            )
        })
        await sendOTPEmail(email,otp)
        res.status(200).json({
            success:true,
            message:"Otp sent Successfully"
        })
    }catch(error){
        console.log(error)
        
        res.status(500).json({
            success:false,
            message:error.message
        })

    }
}
export const verifyOtpAndRegister=async(req,res)=>{
    try{
        const {name,email,password,otp}=req.body;
        
        const userExists=await User.findOne({email});

        const otpRecord=await Otp.findOne({email})
        if (!otpRecord){
            res.status(500).json({
                success:false,
                message:'OTP not Found'
            })
        }

        if(otpRecord.expiresAt<new Date()){
            res.status(400).json({
                success:false,
                message:'OTP Expired'
            })
        }

        if(otpRecord.otp!==otp){
            res.status(400).json({
                success:false,
                message:'Invalid OTP'
        })
        }
        
        if(userExists){
            return res.status(400).json({
                success:false,
                message:'User already Exists'
            });
        }   

        const hashedPassword=await bcrypt.hash(password,10);

        const user= await User.create({
            name,
            email,
            password:hashedPassword,
        })

        await Otp.deleteMany({email})
        const token=generateWebToken(user._id);

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000
        }); 
        
        res.status(201).json({
            success:true,
            message:"Registration Successful!",
            user:{
                id:user._id,
                name:user.name,
                email:user.email,
            }
        })  
    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message,
        });
    }
}

export const loginUser=async(req,res)=>{

    try{
    const {email,password}=req.body;

    let user=await User.findOne({email});

    if(!user){
        return res.status(400).json({
            success:false,
            message:"Invalid email or Password."
        })
    }

    let isMatch= await bcrypt.compare(password,user.password);

    if(!isMatch){
       return res.status(400).json(
            {
                success:false,
                message:"Invalid email or Password"
            }
        )
    }

    const token=generateWebToken(user._id);
    console.log("CLIENT_URL:", process.env.CLIENT_URL);

    res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000
    });
    console.log("Cookie Set Successfully");

    res.status(200).json({
        success:true,
        message:"Log in Successful",
        user:{
            id:user._id,
            name:user.email,
            email:user.email
        }
    });

  }catch(error){
    res.status(500).json({
        success:false,
        message:error.message,
    })
  }
}

export const logoutUser=async(req,res)=>{

   res.clearCookie('token',{
    httpOnly:true,
    secure:true,
    sameSite:"none",
   })

    res.status(200).json(
        {
        success:true,
        message:"Logged out Successfully"
        }
    )
}

export const googleLogin=async(req,res)=>{
    try{
        const {credential} = req.body

        if(!credential){
            return res.status(400).json({
                success:false,
                message:'Google Credential is Required'
            })
        }

        const ticket=await googleClient.verifyIdToken({
            idToken:credential,
            audience:process.env.GOOGLE_CLIENT_ID,
        })

        const payload=ticket.getPayload();

        if(!payload || !payload.sub || !payload.email || payload.email_verified!==true){
            return res.status(400).json({
                success:false,
                message:"Google account verification failed"
            })
        }

        const {sub:googleId,email,name}=payload;

        let user=await User.findOne({
            email:email.toLowerCase(),
        })

        if(user){
            if (user.googleId && user.googleId!==googleId){
                return res.status(409).json({
                    success:false,
                    message:"Google account does not match"
                });
            }

            if(!user.googleId){
                user.googleId=googleId;
                await user.save()
            }
        }
        else{
            user=await User.create({
                name:name || email,
                email:email.toLowerCase(),
                googleId:googleId
            });
        }

        const token=generateWebToken(user._id)

        res.cookie("token",token,{
            httpOnly:true,
            secure:true,
            sameSite:"none",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })

        res.status(200).json({
            success:true,
            message:"Google login successful",
            user:{
                id:user._id,
                name:user.name,
                email:user.email,
            }
        })

    }catch(err){
         console.error("Google login error:", err);
        res.status(401).json({
            success:false,
            message:"Google authentication failed"
        })

    }
}

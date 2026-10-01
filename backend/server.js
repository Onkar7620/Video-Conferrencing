import dotenv from "dotenv";
dotenv.config();
// import dns from "dns";
// dns.setDefaultResultOrder("ipv4first");

import express from 'express';
const app=express();
app.set("trust proxy", 1);
const PORT=process.env.PORT || 8080;
import { sendOTPEmail } from "./utils/sendEmail.js";
// console.log("EMAIL_USER =", process.env.EMAIL_USER);
// console.log("EMAIL_PASS =", process.env.EMAIL_PASS);


import http from "http";
import { Server } from "socket.io";
import socketHandler from './sockets/socket.js';

import mongoose from "mongoose"
import cors from "cors";
import cookieParser from "cookie-parser"

import authRoutes from "./router/authRoutes.js"
import meetingRoutes from "./router/meetingRoutes.js";

app.use(cors({
    origin:["http://localhost:5173",process.env.CLIENT_URL,],
    credentials:true
}));
app.use(express.json());
app.use(cookieParser());

import { Protect } from './middlewere/authMiddlewere.js';



app.use("/api/auth",authRoutes);
app.use("/api/meeting",meetingRoutes);


mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    console.log("MongoDb connection is Successful.")
})

// app.listen(port,()=>{
//     console.log("Server is Started...")
// })

app.get("/me",Protect,async (req,res)=>{
    res.json({
        success:true,
        user:req.user,
    })
})
//Otp Route
app.get("/test-mail", async (req, res) => {
  try {
    console.log("EMAIL_USER =", process.env.EMAIL_USER);
    console.log("EMAIL_PASS length =", process.env.EMAIL_PASS?.length);
    await sendOTPEmail("upasenamrata14@gmail.com", "123456");
    res.send("Mail Sent");
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
});

app.get('/',(req,res)=>{
    res.send("this is the dashboard")
})

const server=http.createServer(app);

const io=new Server(server,{
    cors:{
        origin:["http://localhost:5173",process.env.CLIENT_URL],
        credentials:true
    },
});

socketHandler(io);

server.listen(PORT,()=>{
    console.log(`server is listening`)
})
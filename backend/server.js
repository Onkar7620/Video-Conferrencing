import express from 'express';
const app=express();
const port=8080;

import http from "http";
import { Server } from "socket.io";
import socketHandler from './sockets/socket.js';

import mongoose from "mongoose"
import cors from "cors";
import cookieParser from "cookie-parser"
import dotenv from "dotenv"

import authRoutes from "./router/authRoutes.js"
import meetingRoutes from "./router/meetingRoutes.js";

dotenv.config();
app.use(express.json());
app.use(cookieParser());

import { Protect } from './middlewere/authMiddlewere.js';

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}));

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

app.get('/',(req,res)=>{
    res.send("this is the dashboard")
})

const server=http.createServer(app);

const io=new Server(server,{
    cors:{
        origin:"http://localhost:5173",
        credentials:true
    },
});

socketHandler(io);

server.listen(port,()=>{
    console.log(`server is listening`)
})
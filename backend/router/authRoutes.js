import express from "express";

import {
    registerUser,
    loginUser,
    logoutUser,
    sendOtp,
    verifyOtpAndRegister
} from "../controller/authController.js";

const router=express.Router();
router.post("/send-otp",sendOtp);
router.post("/register",verifyOtpAndRegister);
router.post("/login",loginUser);
router.post("/logout",logoutUser);

export default router;
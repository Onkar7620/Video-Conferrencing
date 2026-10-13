import express from "express";

import {
    loginUser,
    logoutUser,
    sendOtp,
    verifyOtpAndRegister,
    googleLogin,
} from "../controller/authController.js";

const router=express.Router();
router.post("/send-otp",sendOtp);
router.post("/register",verifyOtpAndRegister);
router.post("/login",loginUser);
router.post("/logout",logoutUser);
router.post("/google", googleLogin);

export default router;
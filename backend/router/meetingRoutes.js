import {createMeeting,joinMeeting, endMeeting} from "../controller/meetingController.js";

import {Protect} from "../middlewere/authMiddlewere.js"

import express from "express"

const router=express.Router();

router.post("/createMeeting",Protect,createMeeting);
router.post("/joinMeeting",Protect,joinMeeting);
router.post("/endMeeting",Protect,endMeeting );

export default router;
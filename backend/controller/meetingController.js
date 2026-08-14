import Meeting from "../models/meeting.js";
import { generateMeetingId } from "../utils/generateMeetingId.js";

export const createMeeting=async(req,res)=>{
    try{
        const meetingId=generateMeetingId();

        const meeting=await Meeting.create({
            meetingId:meetingId,
            host:req.user.id,
            participants:[req.user.id]
        })  

        res.status(200).json({
            success:true,
            meeting
        });
    }catch(error){
        console.log(error)
        res.status(500).json({
            success:false,
            message:"Unable to create Meeting"
        })
    }
    }

    export const joinMeeting=async(req,res)=>{

        try{

        // console.log("joinMeeting APi successful")

        const {meetingId}=req.body;

        const meeting= await Meeting.findOne({
            meetingId,
            isActive:true
        });
        // console.log(meeting)
        if(!meeting){
            return res.status(400).json({
                success:false,
                message:"Meeting not Found"
            })
        }

        const alreadyJoined = meeting.participants.some(
            (participant)=>{
                return participant.toString()===req.user.id;
            }
        )
        console.log("alreadyJoined=",alreadyJoined);

        if(!alreadyJoined){
            meeting.participants.push(req.user.id);
            await meeting.save();
        }

        return res.status(200).json({
            success:true,
            meeting,
        })
        }catch(error){
                // console.log("Join Meeting Error:", error);
            res.status(500).json({
                success:false,
                message:"Unable to Join Meeting",
            })
        }
    }

export const endMeeting=async(req,res)=>{
    try{
        const {meetingId}=req.body;

        const meeting= await Meeting.findOne({meetingId});

        if(!meeting){
            return res.status(404).json({
                success:false,
                message:'Meeting Not Found'
            });
        }

        if(meeting.host.toString()!==req.user.id){
            return res.status(403).json({
                success:false,
                message:"only Host can end the Meeting"
            })
        }

        meeting.isActive=false;
        await meeting.save();
        return res.status(200).json({
            success:true,
            message:"Meeting Ended"
        })
    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
};
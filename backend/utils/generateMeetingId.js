import crypto from "crypto";

export const generateMeetingId=()=>{
    return crypto.randomBytes(4).toString("hex").toUpperCase();
}
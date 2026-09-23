import mongoose from 'mongoose'

const Schema=mongoose.Schema

const otpSchema=new Schema({
    email:{
        type:String,
        required:true
    },
    otp:{
        type:String,
        required:true
    },
    expiresAt:{
        type:Date,
        required:true
    }
})

export default mongoose.model('Otp',otpSchema)

import mongoose from 'mongoose';

const Schema=mongoose.Schema;

const userSchema=new Schema(
    {
        name:{
            type:String,
            required:true
        },
        email:{
            type:String,
            required:true,
            unique:true,
            lowercase: true,
            trim: true,
        },
        password:{
            type:String,
            required:false
        },
        googleId:{
            type:String,
            sparse:true,
        }
    },
        {timestamps:true}
    
);

const User=mongoose.model("User",userSchema);

export default User;
import jwt from "jsonwebtoken"


export const Protect=(req,res,next)=>{

    try{
    // const token=req.cookie.token;
    const token=req.cookies.token;
    console.log("Cookies:", req.cookies);
    console.log("Token:", req.cookies.token);
    
// console.log("Before Verify");

const decoded = jwt.verify(token, process.env.JWT_SECRET);

// console.log("After Verify");


    if(!decoded){
        
        return res.status(401).json({
            success:false,
            message:"Not Authorised."
        })
    }


    req.user=decoded;
    next();

    }catch(error){
        res.status(401).json({
            success:false,
            message:"Invalid Token",
        })
    }
}
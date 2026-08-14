import jwt from 'jsonwebtoken';

let generateWebToken=(userId)=>{
    return jwt.sign(
        {id:userId},
        process.env.JWT_SECRET,
        {expiresIn:'7d'},
    );
    
}

export default generateWebToken;
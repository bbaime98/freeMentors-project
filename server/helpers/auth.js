import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
const auth = (req,res,next)=>{
    const token = req.header('token'); 
    if(!token){
        return res.status(401).json({
            status:401,
            error:"no token provided"
        })   
    }
    try{
    const decoded =  jwt.verify(token,process.env.JWTPRIVATEKEY)
    req.user = decoded;
    
    next();
    }
    catch(ex){ 
        res.status(401).json({
            status:401,
            error:" invalid token "
        });
    };
}


export default auth;
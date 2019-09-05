import jwt from 'jsonwebtoken';
import users from '../models/users';
import bcrypt from 'bcrypt';

export default class USers {
 static signup (req,res){
    const user = users.find(userof=>userof.email === req.body.email)
    if (user){
        return res.status(409).json({
            status:409,
            error:"the email already exists"
        })
    }
    const newUser ={
        id:users.length+1,
        first_name:req.body.first_name,
        last_name:req.body.last_name,
        email:req.body.email,
        password: bcrypt.hashSync(req.body.password,10), 
        address:req.body.address,
        bio:req.body.bio,
        occupation:req.body.occupation,
        expertise:req.body.expertise,
        is_mentor:req.body.is_mentor ||false,
        is_admin:req.body.is_admin ||false 
    } 
    
    if(req.body.is_admin  && req.body.is_mentor ){
        return res.status(403).json({
            status:403,
            error:" not allowed to be both admin and mentor "
        })
    }
    const token = jwt.sign({
        id:newUser.id,
        is_mentor:newUser.is_mentor,
        is_admin:newUser.is_admin,
        email:req.body.email
    },process.env.JWTPRIVATEKEY);
    res.header('token',token);
     users.push(newUser);
     res.status(201).json({
         status:201,
         message:"user created successfully",
         data: {
             message:"user created successfully",
             token:token,
             id:newUser.id,
             first_name:req.body.first_name,
             email:req.body.email,
             is_mentor:newUser.is_mentor   
         }
     })
}
static signin(req,res) {
    const user = users.find(userof=>userof.email === req.body.email);
    if(!user){
        return res.status(404).json({
            status:404,
            error:"User not found"
        })
    }
    const password = bcrypt.compareSync(req.body.password,user.password); 
    if (!password){
        return res.status(403).json({
            status:403,
            error:"Invalid email or password"
        })
    }
    const token = jwt.sign({
        id:user.id,
        is_mentor:user.is_mentor,
        is_admin:user.is_admin,
        email:user.email
    },process.env.JWTPRIVATEKEY)
    res.header('token',token)
    res.status(200).json({
        status:200,
        message:"user is successfully logged in",
        data:{
            token:token,
            id:user.id,
            first_name: user.first_name,
            email:user.email
        }
    })
}

}

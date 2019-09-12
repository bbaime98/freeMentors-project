import users from '../models/users';

const allusers = (req,res)=>{
    res.status(200).json({
        status:200,
        data:users
    })
}



export default allusers;
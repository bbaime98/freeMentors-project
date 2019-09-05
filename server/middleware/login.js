import Joi from 'joi';

const signinValidate = (req,res,next)=>{
    const schema={
        email: Joi.string().email().required(),
        password: Joi.string().required()
    }
    const {error} = Joi.validate(req.body,schema);
    if(error){
        res.status(400).json({
            status:400,
            error:error.details[0].message
        })
    }
    next();
} 

export default signinValidate;
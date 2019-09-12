import Joi from 'joi';

const validateuser = (req,res,next)=>{
    const schema ={
        first_name:Joi.string().required(),
        last_name:Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        address:Joi.string().required(),
        bio:Joi.string().required(),
        occupation:Joi.string().required(),
        expertise:Joi.string().required(),
        is_mentor:Joi.boolean().strict(),
        is_admin:Joi.boolean().strict()
    }
    const {error} = Joi.validate(req.body,schema);
    if(error){
        return res.status(400).json({
            status:400,
            error:error.details[0].message
        })
    }
    next();
}

export default validateuser;
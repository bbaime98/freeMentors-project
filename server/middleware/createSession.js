import Joi from 'joi';

const createValidater = (req,res,next)=>{
    const schema = {
        mentorId: Joi.number().integer().required(),
        questions: Joi.string().min(5).max(30).required()
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

export default createValidater;
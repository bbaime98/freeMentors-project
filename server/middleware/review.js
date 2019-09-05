import Joi from 'joi';


const review = (req,res,next)=>{
    const schema = {
        Score : Joi.number().integer().min(1).max(5).required(),
        Remark: Joi.string().required(),
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

export default review;
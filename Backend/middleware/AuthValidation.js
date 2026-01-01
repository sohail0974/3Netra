const joi = require('joi');

const LoginValidation = async(req,res,next)=>{
    const Schema = joi.object({
        name:joi.string().min(3).max(20).required(),
        email:joi.string().email().required(),
        password:joi.string().min(4).max(20).required()
    
    })
    const {error} = Schema.validate(req.body);
    if(error){
        return res.status(400).json({message:"Bad request",error})
    }
    next();
}
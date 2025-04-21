const Joi = require('joi');
const express = require('express');
const app = express();

const signupValidation = (req, res, next) => {
    const schema = Joi.object({
        name:Joi.string().min(3).max(100).required(),
        username:Joi.string().min(3).max(100).required(),
        email:Joi.string().min(3).max(100).email().required(),
        password:Joi.string().min(3).max(100).required(),
<<<<<<< HEAD
        
=======

>>>>>>> 8b1939a6c9ac38500d05a15c6c357cedf771d53f
    })

    const {error} = schema.validate(req.body);

    if(error){
        res.status(401).json({message:'Bad request', error})
    }
    next();

}

const loginValidation = (req, res, next) => {
    const schema = Joi.object({
        username:Joi.string().min(3).max(100).required(),
        password:Joi.string().min(3).max(100).required(),
        role: Joi.string().min(3).max(100).valid('user', 'admin').optional()
       
    })

    const {error} = schema.validate(req.body);
    
    if(error){
        res.status(401).json({message:'Bad request', error})
    }

    next();

}

module.exports = {
    signupValidation,
    loginValidation
}

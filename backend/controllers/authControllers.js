const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const {sendEmail, sendWelcomeMessage, resetPasswordEmailOtp} = require('../middlewares/Email.js');
const Project = require('../models/ProjectSchema.js');

const signup = async(req, res) => {
    try{
        const {name, username, email, password, role} = req.body;
        console.log(name);
        const userData = await User.findOne({email});
        
        if(userData){
            return res.status(201).json({message:'User already exist'})
        }
        else{ 
            // const user = new User({name, username, email, password, role});
            const hashedPassword = await bcrypt.hash(password, 10);
            const verifiedCode = Math.floor((1000 + Math.random() * 9999)).toString()
            await sendEmail(email, verifiedCode, username);
            const user = new User({
                name,
                username,
                email,
                password:hashedPassword,
                role,
                verifiedCode:verifiedCode
            })
            console.log(user);
            await user.save();
            return res.status(201).json({success: 'Account created successfully'})
        }

    }
    catch(error){
        res.status(401).json({error: 'Internal server error'});
        throw(error);
    }
}

const login = async(req, res) => {
    try{
        const {username, password, role} = req.body;
        console.log(username);
        console.log(password);
        console.log(role);
        // console.log(username);
        // console.log(role);
        // console.log(password);
        // console.log(username);
        const user = await User.findOne({username});
        
        // console.log(user);
        
        
        if(!user){
            return res.status(400).json({message:'Unauthorized user'});
        }
        const id = user._id;
        if(user.role !== role){
            return res.status(400).json({message:'This user is not available for this role'})
        }
        const isPassword = await bcrypt.compare(password, user.password);
        if(!isPassword){
            return res.status(400).json({message:'Invalid username or password'});
        }
        const jwtToken = jwt.sign(
            {username : user.username, id:user._id},
            process.env.JWT_SECRET,
            {expiresIn:'24h'}
        )

        res.status(200).json({success: 'Login successfully',
            jwtToken,
            username,
            id,
            name:user.name,
            role:user.role,
            email:user.email
        })
    }
    catch(error){
        res.status(401).json({error: 'Internal server error'});
        throw(error);
    }
}

const verifyOtp = async(req, res) => {
    try{
        const {otp} = req.body;
        console.log(otp);
        const user = await User.findOne({verifiedCode:otp});
        
        if(!user){
            return res.status(400).json({error:'Invalid otp'})
        }
        else{
            const id = user._id;
            await User.findByIdAndUpdate(id, {verified:true})
            await User.findByIdAndUpdate(id, {verifiedCode:''})
            sendWelcomeMessage(user.email, user.username);
            return res.status(400).json({success:'Email verified successfully'});
        }
    }   
    catch(error){
        res.status(500).json({error:'Internal server error'});
    }
}

const resetPasswordOtp = async(req, res) => {
    try{
        const {email} = req.body;
        const user = await User.findOne({email:email});
        if(!user){
            return res.json({error:"user with this email is not present"})
        }
            const id = user._id;
            const verifiedCode = Math.floor((1000 + Math.random() * 9999)).toString();
            await User.findByIdAndUpdate(id, {password:''});
            await User.findByIdAndUpdate(id, {verifiedCode:verifiedCode});
            resetPasswordEmailOtp(user.email, verifiedCode, user.username);
            return res.status(201).json({success:'otp successfully sent to your email'})  
    }
    catch(error){

    }
}

const resetPassword = async(req, res) => {
    try{
        const {otp, username, password} = req.body;
        const user = await User.findOne({verifiedCode:otp})
        if(!user){
            return res.json({error:'Invalid otp'});
        }
        if(user.username !== username){
            return res.status(400).json({error: 'Username is incorrect'})
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const id = user._id;
        await User.findByIdAndUpdate(id, {password:hashedPassword});
        await User.findByIdAndUpdate(id, {verifiedCode:''});
        return res.status(200).json({success:'Password is changed'});
    }
    catch(error){
        return res.status(500).json({error:'Internal server error'});
    }
}

const addFavourites = async(req, res)=>{
    try{
        const {projectid, id, username} = req.headers;

    const user = await User.findById(id);
    const isFavourites = user.favourites.includes(projectid);
    
    if(isFavourites){
        return res.status(200).json({message:"This project is already in favourites"})
    }

    await User.findByIdAndUpdate(id, {$push:{favourites:projectid}})
    return res.status(200).json({success:'Project added in favourites'});
    }
    catch(error){
        return res.status(500).json({error:error})
    }

    
}   
const showFavourites = async(req, res) => {
    try{
        const userId = req.params.userid;
        const userProjects = await User.findById(userId).populate('favourites');
        if(!userProjects){
            return res.status(200).json({message:"No projects in favourites"})
        }
        return res.status(200).json(userProjects.favourites)
    }
    catch(error){
        return res.status(500).json({error:'Internal sever error'})
    }

}
const removeFavourites = async(req, res) => {
    try{
        const {projectid, id} = req.headers;
        const user = await User.findById(id);
        const userFavourites = user.favourites.includes(projectid);
      
        if(userFavourites) {
            await User.findByIdAndUpdate(id, {$pull:{favourites:projectid}});
        }
        return res.status(200).json({success:'This favourite is removed'})
    }
    catch(error){
        return res.status(500).json({error:'Internal server error'})
    }
}

const removeUser = async(req, res) => {
    try{
        const {userid} = req.headers;
        await Project.deleteMany({user:userid});
        await User.findByIdAndDelete(userid);
        return res.status(200).json({success:'User deleted successfully'});
    }
    catch(error){
        return res.status(500).json({error:'Internal server error'})
    }
}

const blockUser = async(req, res) => {
    try{
        const {userid} = req.headers;
        await User.findByIdAndUpdate(userid, {blocked:true})
        return res.status(200).json({success:'This user is blocked'})
    }
    catch(error){
        return res.status(500).json({error:'Internal server error'})
    }
}

const unblockUser = async(req, res) => {
    try{
        const {userid} = req.headers;
        await User.findByIdAndUpdate(userid, {blocked:false});
        return res.status(200).json({success:'This user is unblocked'})
    }
    catch(error){
        return res.status(500).json({error:error})
    }
}

module.exports = {
    signup,
    login,
    verifyOtp,
    resetPasswordOtp,
    resetPassword,
    addFavourites,
    removeFavourites,
    showFavourites,
    removeUser,
    blockUser,
    unblockUser
}

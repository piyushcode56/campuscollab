const router = require('express').Router();
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Project = require('../models/ProjectSchema');
const ensureUserAuthenticated = require('../middlewares/userAuthentication');
const User = require('../models/User')


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = 'uploads/';
        if(!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }
        cb(null, dir);
    },

    filename:(req, file, cb) => {
        cb(null, Date.now() + " " + file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    const allowedFileTypes = /jpeg|jpg|png|gif|mp4|mp3|avi|mov|pdf|docx|text|txt|pptx|ppt|md|document|JPG/;
    const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedFileTypes.test(file.mimetype);
    
    if(extname && mimetype){
        cb(null, true)
    } else{
        cb(null, error('This document file is not supported'))
    }
}

const upload = multer({
    storage:storage,
    fileFilter:fileFilter,
    limits:{fileSize: 100000000}
})
router.use('/uploads', express.static(path.join(__dirname, 'uploads')))


router.post('/uploads', upload.fields([
    {name:'files', maxCount:15},
    {name:'image', maxCount:1}
]), ensureUserAuthenticated, async(req, res) => {
    try{
        const {projectData, projectDevelopers, existingFiles} = req.body;
        // console.log(projectData);
        const parsedProjectData = typeof projectData === 'string' ? JSON.parse(projectData) : projectData
        const parsedProjectDevelopers = typeof projectDevelopers === 'string' ? JSON.parse(projectDevelopers) : projectDevelopers
        const {userid} = req.headers;
        const userdata = await User.findById(userid);
        if(userdata.blocked){
            return res.status(200).json({message:'You are blocked by admin'})
        }
        // console.log(parsedProjectDevelopers);
        const files = (req.files['files'] || []).map((file) => ({
            fileName:file.originalname,
            fileSize:file.size,
            fileUrl:file.path,
            fileType:file.mimetype
        }))
       
        const image = req.files['image']?.[0]?.path;
        
        // let projectDetails = {
        //     user:req.user.id,
        //     name:parsedProjectData.name,
        //     domain:parsedProjectData.domain,
        //     description:parsedProjectData.description,
        //     files
        // }
        
        // if(parsedProjectDevelopers && Object.keys(parsedProjectDevelopers).length > 0){
        //     projectDetails.developers = {
        //             developer1: parsedProjectDevelopers.developer1,
        //             developer2: parsedProjectDevelopers.developer2,
        //             developer3: parsedProjectDevelopers.developer3,
        //             developer4: parsedProjectDevelopers.developer4,
        //             developer5: parsedProjectDevelopers.developer5
        //     }
        //     parsedProjectData.developer = '';
        // } 
        // else if(parsedProjectData.developer){
        //     projectDetails.developer = parsedProjectData.developer;
        //     projectDetails.developers = '';
        // } 
        // else{
        //     return res.status(400).json({error:'developer information is missing'})
        // }
         
        // const newProject = new Project(projectDetails);
        // console.log(newProject);
        // await newProject.save();
        // res.status(201).json({success:'project data uploaded successfully'})

        if(parsedProjectDevelopers && Object.keys(parsedProjectDevelopers).length > 0) {
            const developers = {
                developer1: parsedProjectDevelopers.developer1,
                developer2: parsedProjectDevelopers.developer2,
                developer3: parsedProjectDevelopers.developer3,
                developer4: parsedProjectDevelopers.developer4,
                developer5: parsedProjectDevelopers.developer5
            }
            const projectDetails = {
                user:req.user.id,
                name:parsedProjectData.name,
                introduction:parsedProjectData.introduction,
                domain:parsedProjectData.domain,
                image:image,
                developer:'',
                developers:developers,
                description:parsedProjectData.description,
                otherLinks:parsedProjectData.otherLinks,
                files:files
            }

            const newProject = new Project(projectDetails);
            console.log(newProject);
            await newProject.save();
            return res.status(201).json({success:'project data uploaded successfully'})
        } 
        else if(parsedProjectData.developer){
            const projectDetails = {
                user:req.user.id,
                name:parsedProjectData.name,
                introduction:parsedProjectData.introduction,
                domain:parsedProjectData.domain,
                image:image,
                developer:parsedProjectData.developer,
                developers:parsedProjectDevelopers.developers || '',
                description:parsedProjectData.description,
                otherLinks:parsedProjectData.otherLinks,
                files:files
            }
           
            const newProject = new Project(projectDetails);
            console.log(newProject);
            await newProject.save();
            return res.status(201).json({success:'project data uploaded successfully'})
        }
        else{
            return res.status(400).json({error:'developer data is missing'})
        }
    }
    catch(error){
        res.status(500).json({error:'Internal server error'})
    }
})


router.get('/myprojects/:userid', async(req, res) => {
    try{
        const userId = req.params.userid;
        const projects = await Project.find({user:userId});
        res.status(200).json({projects});
    }
    catch(error){
        res.status(500).json({error:'cannot fetched the book'})
    }
})

router.get('/project/:projectid', ensureUserAuthenticated, async(req, res) => {
    try{
        const projectId = req.params.projectid;
        // console.log(projectId);
        const projects = await Project.findById(projectId);
        // const parsedProjectsName = projects.projects;
        res.status(200).json({projects});
    }
    catch(error){
        res.status(400).json({error : "No project data available"})
    }
})

router.get('/allprojects', ensureUserAuthenticated, async(req, res) => {
    try{
        const projects = await Project.find();
        res.status(200).json({projects});
    }
    catch(error){
        res.status(500).json({error:'Internal server error'})
    }
    
})

router.get('/editprojectdata/:projectId', async(req, res) => {
    try{
        const projectId = req.params.projectId;
        const newProject = await Project.findOne({_id:projectId});
        return res.status(200).json({newProject});
    }
    catch(error){
        return res.status(500).json({error:'Internal server error'})
    }
})

router.delete('/delete-project', async(req, res) => {
    try{
        const {projectid} = req.headers;
        await Project.findByIdAndDelete(projectid);
        return res.status(200).json({success:'Project deleted successfully'})
    }
    catch(error){
        return res.status(500).json({error:'Internal server error'})
    }
})


module.exports = router;
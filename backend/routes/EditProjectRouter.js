const multer = require('multer');
const express = require('express');
const router = require('express').Router();
const path = require('path');
const fs = require('fs');
const Project = require('../models/ProjectSchema');
const ensureUserAuthenticated = require('../middlewares/userAuthentication')

const storage = multer.diskStorage({
    destination:(req, file, cb)=>{
        const dir = 'uploads/';
        if(!fs.existsSync(dir)){
            fs.mkdirSync(dir)
        }
        cb(null, dir)
    },
    filename:(req, file, cb) => {
        cb(null, Date.now() + " " + file.originalname)
    }

})

const fileFilter = (req, file, cb) => {
    const allowedFileTypes = /jpeg|jpg|png|gif|mp4|avi|mov|pdf|docx|text|txt|pptx|ppt|md|document|JPG/;
    const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedFileTypes.test(file.mimetype);
    
    if(extname && mimetype){
        cb(null, true)
    } else{
        cb(null, error('This document file is not supported'))
    }
}

const updatedUpload = multer({
    storage:storage,
    fileFilter:fileFilter,
    limits:{fileSize: 100000000}
})

router.use('/uploads', express.static(path.join(__dirname, 'uploads')))

router.post('/edit/project/:projectid', updatedUpload.array('editedFiles', 15), ensureUserAuthenticated, async(req, res) => {
    const projectId = req.params.projectid;
    console.log(projectId);
    const {existingProjectDetails, projectDevelopers, existingFiles} = req.body;
    const parsedexistingProjectDetails = typeof existingProjectDetails === 'string' ? JSON.parse(existingProjectDetails):existingProjectDetails
    const parsedProjectDevelopers = typeof projectDevelopers === 'string' ? JSON.parse(projectDevelopers):
    projectDevelopers;
    const parsedExistingFiles = typeof existingFiles === 'string' ? JSON.parse(existingFiles) : existingFiles;
    const uploadedFiles = req.files.map((file) => ({
        fileName: file.originalname,
        fileSize: file.size,
        fileUrl: file.path,
        fileType: file.mimetype,
    }))

    const combinedFiles = [...parsedExistingFiles, ...uploadedFiles];
    if(parsedProjectDevelopers && Object.keys(parsedProjectDevelopers).length > 0) {
        const developers = {
            developer1: parsedProjectDevelopers.developer1,
            developer2: parsedProjectDevelopers.developer2,
            developer3: parsedProjectDevelopers.developer3,
            developer4: parsedProjectDevelopers.developer4,
            developer5: parsedProjectDevelopers.developer5
        }
        await Project.findByIdAndUpdate(projectId , {
            name:parsedexistingProjectDetails.name,
            introduction:parsedexistingProjectDetails.introduction,
            domain:parsedexistingProjectDetails.domain,
            developer:'',
            developers:developers,
            description:parsedexistingProjectDetails.description,
            otherLinks:parsedexistingProjectDetails.otherLinks,
            files:combinedFiles
        })

        return res.status(201).json({success:'project data updated successfully'})
    } 
    else if(parsedexistingProjectDetails.developer){
        await Project.findByIdAndUpdate(projectId, {
        name:parsedexistingProjectDetails.name,
        introduction:parsedexistingProjectDetails.introduction,
        domain:parsedexistingProjectDetails.domain,
        developer:parsedexistingProjectDetails.developer,
        developers:'',
        description:parsedexistingProjectDetails.description,
        otherLinks:parsedexistingProjectDetails.otherLinks,
        files:combinedFiles
        })

        return res.status(201).json({success:'project data updated successfully'})
    }
    
    
})

module.exports = router;
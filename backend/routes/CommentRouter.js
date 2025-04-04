const router = require('express').Router();
const Comments = require('../models/CommentSchema');
router.post('/add-comment', async(req, res) => {
    try{
    const {projectid, userid, comment, username} = req.body;
    const newComment = new Comments({
        projectid:projectid,
        userid:userid,
        comments:comment,
        username:username
    })
    await newComment.save();
    return res.status(201).json({success:'Comment added!'})
    }
    catch(error){
        return res.status(500).json({error:'Internal server error'})
    }
})

router.get('/all-comment', async(req, res) => {
    try{
        const {projectid} = req.headers;
        const comments = await Comments.find({projectid:projectid});
        return res.status(200).json(comments);
    }
    catch(error){
        return res.status(500).json({error:'Internal server error'})
    }
})

module.exports = router;
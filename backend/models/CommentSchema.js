
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    projectid:{
        type:mongoose.Types.ObjectId,
        ref:'project',
        required:true
    },
    userid:{
        type:mongoose.Types.ObjectId,
        ref:'userdata',
        required:true
    },
    comments:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }

})

const Comments = mongoose.model('comment', CommentSchema);

module.exports = Comments;
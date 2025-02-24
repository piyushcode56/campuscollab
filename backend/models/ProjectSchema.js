const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProjectSchema = new Schema({
    user:{
        type:mongoose.Types.ObjectId,
        ref:'userdata'
    },

    name:{
        type:String,
        required:true
    },
    introduction:{
        type:String,
        required:true
    },
    domain:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    image:{
        type: String,
    },
    developer:{
        type:String,
    },
    developers: 
            {
                developer1:{
                type:String,
            },
            developer2:{
                type:String,
            },
            developer3:{
                type:String,
            },
            developer4:{
                type:String,
            },
            developer5:{
                type:String,
            }
        },
    
    
    files: [
        {
            fileName:{
                type:String,
                required:true
            },
            fileSize:{
                type:Number,
                required:true
            },
            fileUrl:{
                type:String,
                required:true
            },
            fileType:{
                type:String
            }
        }
    ],
    otherLinks:{
        type:String
    },
    uploadDate:{
        type:Date,
        default:Date.now()
    }

})

const Project = mongoose.model('project', ProjectSchema);

module.exports = Project;
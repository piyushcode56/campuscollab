const { boolean } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
    
    },
    password:{
        type:String,
        required:true
    },
    verified:{
        type:Boolean,
        default:false
    },
    verifiedCode:String,
    avatar:{
        type:String,
        default:'https://cdn-icons-png.flaticon.com/512/3686/3686930.png'
    },
    role:{
        type:String,
        default:'user',
        enum:['user', 'admin']
    },
    favourites:[
        {
            type:mongoose.Types.ObjectId,
            ref:'project'
        }
    ],
    blocked:{
        type:Boolean,
        default:false
    }
})

const User = mongoose.model('userdata', UserSchema);

module.exports = User;


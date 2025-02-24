const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host:'smtp.gmail.com',
    port: 587,
    secure:false,

    auth:{
        user:'piyushjha8282@gmail.com',
        pass:'hqxf jiyn yiez hwfw'
    },

})

// sendEmail();
module.exports = transporter;
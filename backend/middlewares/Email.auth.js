const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host:'smtp.gmail.com',
    port: 587,
    secure:false,

    auth:{
        user:'piyushjha8282@gmail.com',
        pass:'nyeb koaj lfvh eozz'
    },

})

// sendEmail();
module.exports = transporter;
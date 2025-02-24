const transporter = require('./Email.auth.js');
const { Welcome_Email_Template, Verification_Email_Template, Reset_Password_Email_Template } = require('../models/EmailTemplate');
const sendEmail = async(email, verifiedCode, username)=>{
    console.log(email);
    try{
        const information = await transporter.sendMail({
            from:'"campus collab" <piyushjha8282@gmail.com>',
            to:`${email}`,
            subject:'OTP Verification',
            text:'This is your one time password(OTP) for verifiying your email account?',
            html:Verification_Email_Template.replace("{verificationCode}", verifiedCode).replace("{name}", username),
            
        });
       console.log('OTP sent successfully', information)
    }
    catch(error){
        console.log(error);
    }
}
const sendWelcomeMessage = async(email, username)=>{
    // console.log(email);
    try{
        const information = await transporter.sendMail({
            from:'"campus collab" <piyushjha8282@gmail.com>',
            to:`${email}`,
            subject:'Welcome to campus collab',
            // text:'This is your one time password(OTP) for verifiying your email account?',
            html:Welcome_Email_Template.replace("{name}", username),
            
        });
       console.log('OTP sent successfully', information)
    }
    catch(error){
        console.log(error);
    }
}

const resetPasswordEmailOtp = async(email, verifiedCode, username) => {
    try{
        const information = await transporter.sendMail({
            from:'"campus collab" <piyushjha8282@gmail.com>',
            to:`${email}`,
            subject:'Reset Password',
            // text:'This is your one time password(OTP) for verifiying your email account?',
            html:Reset_Password_Email_Template.replace("{name}", username).replace("{otp}", verifiedCode)
            
        });
       console.log('OTP sent successfully', information)
    }
    catch(error){
        console.log(error);
    }
}
module.exports = {
    sendEmail,
    sendWelcomeMessage,
    resetPasswordEmailOtp
}
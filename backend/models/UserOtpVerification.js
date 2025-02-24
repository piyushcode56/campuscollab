const mongoose = require('mongoose');
const schema = mongoose.Schema;

const UserOtpVerificationSchema = new schema({
    userId:String,
    otp:String,
    createdAt:Date,
    expiredAt:Date
})

const UserOtpVerification = mongoose.model('userOtpVerification', UserOtpVerificationSchema)

module.exports = UserOtpVerification;
var Model = require('../models/index');
const config = require('../config/config');
const mongoose = require('mongoose');
const Handlebars = require('handlebars');

const sendOtp=async (payload)=>{
    const eventType=payload.eventType
    const otpCode=Math.floor(100000 + Math.random() * 900000);
   
    const otpData = await new Model.Otp({
        otpCode: otpCode,userId: payload.userid,phoneNo:payload.phoneNo,
        countryCode:payload.countryCode, eventType:eventType}).save(); 
    return otpData;
}

const verify=async (payload)=> {
    if (payload.otp == '123456') {
        //console.log(payload.phoneNo);

       const eventType=payload.eventType
       const otpData=await Model.Otp.findOne({otpCode: payload.otpCode,eventType:eventType,
        phoneNo:payload.phoneNo,countryCode:payload.countryCode});
            if (!otpData) return false;
            await Model.Otp.deleteMany({_id:mongoose.Types.ObjectId(otpData._id)});
            return otpData;
    } else {
        const eventType=payload.eventType
        const otpData=await Model.Otp.findOne({otpCode: payload.otpCode,eventType:eventType,
            phoneNo:payload.phoneNo,countryCode:payload.countryCode});
            if (!otpData) return false;
            await Model.Otp.deleteMany({_id:mongoose.Types.ObjectId(otpData._id)});
            return otpData;
    }
}

module.exports = {
    sendOtp:sendOtp,
    verify:verify
}

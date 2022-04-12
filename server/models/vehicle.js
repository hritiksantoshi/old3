const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VehicleModel = new Schema({
    vehicleName: {
        type: String,default:''
    },
    vehicleModel: {
        type: String,index:true,default:''
    },
    chassisNumber: {
        type: String,index:true,unique:true,default:''
    },
    vehicleNumber: {
        type: String,index:true,unique:true,default:''
    },
    hourlyRate: {
        type: String,index:true,default:''
    },
    perdayRate: {
        type: String,index:true,default:''
    },
    passengerCapacity: {
        type: String,index:true,default:''
    },
    vehicleType: {
        type: String,enum:['suv','xuv','hybrid']
    }
})
const Owner = new mongoose.model("Vehicle",VehicleModel);

module.exports = Owner;
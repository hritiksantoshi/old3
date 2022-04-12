const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const clientModel = new Schema({
    name: {
        type: String,default:''
    },
    email: {
        type: String,index:true,unique:true,default:''
    },
    passenger: {
        type: String,default:''
    },
    pickupadd: {
        type: {type: String, default:"Point" },

        pcoordinates: [Number]

    },
    dropoffadd: {
        type: {type: String, default:"Point" },

        dcoordinates: [Number]
    },
    latitude: { type: Number,default:0 },
    longitude: { type: Number,default:0},
    date: {
        type: Date,default:''
    },
    time:{
        type: String
    }
})
const booktaxi = new mongoose.model("Client",clientModel);

module.exports = {
    booktaxi: booktaxi
}
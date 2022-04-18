const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const clientModel = new Schema({
    userId:  { type: Schema.ObjectId, ref: 'User' },
    name: {
        type: String, default: ''
    },
    email: {
        type: String, index: true, unique: true, default: ''
    },
    passenger: {
        type: String, default: ''
    },
    pickupadd: {
        type: { type: String, default: "Point" },

        pcoordinates: [Number]

    },
    dropoffadd: {
        type: { type: String, default: "Point" },

        dcoordinates: [Number]
    },
    latitude: { type: Number, default: 0 },
    longitude: { type: Number, default: 0 },
    date: {
        type: Date, default: ''
    },
    booking_status:{
        type:String,
        enum:['Booked','Pending','Rejected'],
        default: 'Pending'
    },
    accepted_by:{
        type:String,
        default: 'Pending'
    }
},
    {
        timestamps: true
    }
);
const booktaxi = new mongoose.model("Booking", clientModel);

module.exports = booktaxi;
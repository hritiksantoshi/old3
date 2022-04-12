const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const imgModel = new Schema({
    image: {type:String,default:''},
    vehicleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "vehicles"
      }
})
const img = new mongoose.model("images",imgModel);

module.exports = img;
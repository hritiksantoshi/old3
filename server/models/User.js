const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
const UserModel = new Schema({
    firstName: {
        type: String,default:''
    },
    lastName: {
        type: String,default:''
    },
    email: {
        type: String,index:true,default:''
    },
    phoneNo: {
        type: String,index:true,default:''
    },
    countryCode: {
        type: String,index:true,default:''
    },
    password: {
        type: String,index:true,default:''
    },
    isVerify: {
        type: Boolean ,
        default:false
    },
    role:{
        type: String , 
        enum:['user','driver'],
        default: 'user'
    },
    profilePic: {
        type:String , default:''
    },
    isDeleted:{
        type: Boolean,
        default: false
    }
})

UserModel.methods.generateAuthToken = async function(){
    try{
    
        const token = jwt.sign({_id:this._id},"myqwerhdkalodpunmxnbcrijasdfghjkl");
        console.log(token);

        return token;
    }
    catch(error){
                   res.send("the error part" + error);
                   console.log("the error part" + error)
    }
}


UserModel.pre('save', function (next) {
    bcrypt.genSalt(10, (error, salt) => {
        if (error) 
        return console.log(error);
        else if(this.password){
            bcrypt.hash(this.password, salt, (err, hash) => {
                if (err) return console.log(err);
                this.password = hash;
                next();
            });
        }
        else{
            next();
        }
    });
});

// UserModel.methods.comparePassword = function (password, cb) {
//     bcrypt.compare(password, this.password, (error, match) => {
//         if (error) return cb(false);
//         if (match) return cb(true);
//         return cb(false);
//     });
// };
const User = new mongoose.model("User",UserModel);

module.exports = User;
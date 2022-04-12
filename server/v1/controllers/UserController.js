const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const Model = require('../../models/index');
const jwt = require("jsonwebtoken");
const universalFunction = require('../../lib/universal-function');




async function register(req, res){
    try {
        const emailUser = await Model.User.findOne({
            email: req.body.email,
            isDeleted: false
        });
        if(emailUser){
            res.send("EMAIL_ALREADY_EXIST");
        }

        if(req.body.phoneNo){
            const userData = await Model.User.findOne({
                phoneNo: req.body.phoneNo,
                isDeleted: false
            });
            if (userData) {
                 res.send("PHONE_NUMBER_ALREADY_EXISTS");
            }
        }

        req.body.profilePic = '';
        if (req.file && req.file.path) {
            req.body.profilePic = `${req.file.path}`;
        }
        let user =  await Model.User(req.body).save();
        res.status(201);
        res.send(user);
        console.log(user);
        
     }
     catch(error){
        res.status(400).send(error);
     }
         
}



async function login(req, res) {
    try {
        let user= await Model.User.findOne({email: req.body.email,isDeleted : false});

        console.log(user);

        if(!user){
            res.send("INVALID_USERNAME_EMAIL");
        }
        
        let isMatch = await bcrypt.compare(req.body.password, user.password);

        console.log(isMatch);

        if(!isMatch){
                      res.send("INVALID_PASSWORD");
        }

        let accesstoken = await universalFunction.jwtSign(user);

        console.log(accesstoken);

        res.status(201).send("USER_LOGIN_SUCCESSFULLY");
        
    }
    catch(error){
        res.status(400).send(error);
    }
}
// function for vehicle registeration

async function owner(req, res) {
    try {
    //    vehicleName: req.body.vehicleName,
    //         vehicleModel: req.body.vehicleModel,
    //         chas let vehicle = await Model.Vehicleowner({
    //         sisNumber: req.body.chassisNumber,
    //         vehicleNumber: req.body.vehicleNumber,
    //         hourlyRate: req.body.hourlyRate,
    //         perdayRate: req.body.perdayRate,
    //         passengerCapacity: req.body.passengerCapacity,
    //         vehicleType: req.body.vehicleType
    //     });
       
        let data = await Model.Vehicleowner(req.body).save();
        

        

        if (req.files.length > 0) {
            await req.files.forEach(file => {

                let book = Model.Vehicleimg({
                    image: file.path,
                    vehicleId: data._id
                })
                book.save();
            });

        }
        else {
            res.send("no file");
        }

        res.status(201);
        res.send(data);
       
    }
    catch (error) {
        res.status(400).send(error);
    }
}


async function gettaxis(req, res) {
    //var a = data._id;
    //console.log(req.taxiData);

    let cab = await Model.vehicleimg.aggregate([
        {
            $lookup: {
                from: 'vehicles',
                localField: 'vehicleId',
                foreignField: '_id',
                as: 'taxiinfo'

            },

        },

        {
            $project: {
                vehicleName: "$taxiinfo.name",
                vehicleType: "$taxiinfo.type",
                image: "$image"
            }
        }
    ]).then((cab) => {
        console.log(cab);
        res.send(cab)
    })
        .catch((error) => {
            console.log(error);
        });
}

//Function for booking taxi
async function booktaxi(req, res) {
    try {

        let pcoordinates = []
        let pickupadd = {}
        if (req.body.latitude && req.body.longitude) {
            pcoordinates.push(Number(req.body.latitude))
            pcoordinates.push(Number(req.body.longitude))
            pickupadd.type = "Point";
            pickupadd.pcoordinates = pcoordinates
        }
        req.body.pickupadd = pickupadd;

        let dcoordinates = []
        let dropoffadd = {}
        if (req.body.latitude && req.body.longitude) {
            dcoordinates.push(Number(req.body.latitude))
            dcoordinates.push(Number(req.body.longitude))
            dropoffadd.type = "Point";
            dropoffadd.dcoordinates = dcoordinates
        }
        req.body.pickupadd = pickupadd;

        let client = await Model.booktaxi(req.body).save();
       

        res.status(201);
        res.send(client);
        console.log(client);

    }
    catch (error) {
        res.status(400).send(error);
    }

}






module.exports = {
    owner: owner,
    gettaxis: gettaxis,
    booktaxi: booktaxi,
    register: register,
    login:login
}
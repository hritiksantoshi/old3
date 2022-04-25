const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const Model = require('../../models/index');
const jwt = require("jsonwebtoken");
const universalFunction = require('../../lib/universal-function');
const Service = require('../../services/index');



//Api for User Registeration
async function register(req, res) {
    try {
        const emailUser = await Model.User.findOne({
            email: req.body.email,
            isDeleted: false
        });
        if (emailUser) {
            res.send("EMAIL_ALREADY_EXISTS");
        }

        if (req.body.phoneNo) {
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
        let user = await Model.User(req.body).save();
        res.status(201);
        res.send(user);
        console.log(user);

    }
    catch (error) {
        res.status(400).send(error);
    }

}



async function login(req, res) {
    try {
        let user = await Model.User.findOne({ email: req.body.email, isDeleted: false });

        console.log(user);

        if (!user) {
            res.send("INVALID_USERNAME_EMAIL");
        }

        let isMatch = await bcrypt.compare(req.body.password, user.password);

        console.log(isMatch);

        if (!isMatch) {
            res.send("INVALID_PASSWORD");
        }

        let accesstoken = await universalFunction.jwtSign(user);

        console.log(accesstoken);

        res.status(201).send("USER_LOGIN_SUCCESSFULLY");

    }
    catch (error) {
        res.status(400).send(error);
    }
}

// login_with_phone Api
async function login_with_phone(req, res) {
    try {
        const userData = await Model.User.findOne({
            phoneNo: req.body.phoneNo,
            countryCode: req.body.countryCode,
            isDeleted: false
        });

        if (!userData) {
            res.send('THIS_USER_IS_NOT_REGISTERED');
        }
        let optData = await Model.Otp.findOne({
            phoneNo: req.body.phoneNo,
            countryCode: req.body.countryCode,
            eventType: 'SEND_OTP'
        });

        if (optData)
            await Model.Otp.deleteMany({
                _id: optData._id
            });
        let sendOtpObj = req.body;
        sendOtpObj.eventType = 'SEND_OTP';
        sendOtpObj.message = 'Your otp code is {{otpCode}}';
        sendOtpObj.userid = userData._id;
        let otpData = await Service.OtpService.sendOtp(sendOtpObj);
        res.send('OTP_CODE_SEND_TO_YOUR_REGISTER_PHONE_NUMBER');


    }
    catch (error) {
        res.status(400).send(error);
    }
}

async function sendOtp(req, res) {
    try {
        const userData = await Model.User.findOne({
            phoneNo: req.body.phoneNo,
            countryCode: req.body.countryCode,
            isDeleted: false
        });
        if (userData) {
            res.send('PHONE_NUMBER_ALREADY_EXISTS');
        }
        let optData = await Model.Otp.findOne({
            phoneNo: req.body.phoneNo,
            countryCode: req.body.countryCode,
            eventType: 'SEND_OTP'
        });
        if (optData)
            await Model.Otp.deleteMany({
                _id: optData._id
            });
        let sendOtpObj = req.body;
        sendOtpObj.eventType = 'SEND_OTP';
        sendOtpObj.message = 'Your otp code is {{otpCode}}';
        const otpData = await Service.OtpService.sendOtp(sendOtpObj);
        console.log(otpData);
        if (otpData) {
            res.send('OTP_CODE_SEND_TO_YOUR_REGISTER_PHONE_NUMBER');
        }
    }
    catch (error) {
        res.status(400).send(error);
    }
}

async function verifyOtp(req, res) {
    try {

        let sendOtpObj = req.body;
        sendOtpObj.eventType = 'SEND_OTP';
        const otpData = await Service.OtpService.verify(sendOtpObj);
        if (!otpData) {
            res.send('INVALID_OTP');
        }
        else {

            let user = await Model.User.updateOne({ _id: otpData.userId }, { $set: { isVerify: true } });
            let udata = await Model.User.findOne({ _id: otpData.userId });
            let accesstoken = await universalFunction.jwtSign(udata);
            console.log(accesstoken);
            res.send('OTP_VERIFIED AND LOGGED_IN.');
        }
    }
    catch (error) {
        res.status(400).send(error);
    }
};



// function for vehicle registeration

async function user(req, res) {
    try {

        let logged_user = await Model.User.findOne({ _id: req.userData._id })
        console.log(logged_user);
        if (logged_user.role == "driver") {
            let driver = req.body;
            driver.userId = req.userData._id;
            let data = await Model.Vehicleowner(driver).save();

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
        else {
            res.send("User not registered as driver.");
        }


    }
    catch (error) {
        res.status(400).send(error);
    }
}


async function gettaxis(req, res) {
    //var a = data._id;
    //console.log(req.taxiData);

    let cab = await Model.Vehicleowner.aggregate([
        {
            $lookup: {
                from: 'users',
                localField: 'userId',
                foreignField: '_id',
                as: 'taxiinfo'

            },

        },

        {
            $lookup: {
                from: 'images',
                localField: '_id',
                foreignField: 'vehicleId',
                as: 'taxi Image'

            },

        },
        {
            $project: {
                vehicleName: "$vehicleName",
                vehicleType: "$vehicleType",
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

        let booking_user = await Model.User.findOne({ _id: req.userData._id });
        if (booking_user.role == "user") {
            let bookdata = req.body;
            bookdata.userId = req.userData._id;
            let client = await Model.booktaxi(bookdata).save();
            res.status(201);
            res.send(client);
            console.log(client);
        }

        if (booking_user.role !== "user") {
            res.send('YOU_ARE_NOT_REGISTERED_AS_USER');
        }



    }
    catch (error) {
        res.status(400).send(error);
    }

}



async function user_bookings(req, res) {
    var userid = req.userData._id;

    let booking = await Model.booktaxi.aggregate([
        {
            $match: {
                userId: mongoose.Types.ObjectId(userid)
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'userId',
                foreignField: '_id',
                as: 'user'

            },


        },
        {
            $project: {
                Booked_by: "$name",
                Passengers: "$passenger",
                time: "$time",
                carType: "$carType",
                booking_status: "$booking_status",
                accepted_by: "$accepted_by"

            }
        }

    ]).then((booking) => {
        console.log(booking);
        res.send(booking)
    })
        .catch((error) => {
            console.log(error);
        });
}

async function gettaxis_byuser(req, res) {
   let taxi = await Model.Vehicleowner.aggregate([
    {
        $match: {
            vehicleType: req.query.carType
        }
    },
    {
        $lookup: {
            from: 'images',
            localField: '_id',
            foreignField: 'vehicleId',
            as: 'taxes'

        },


    },

   ]).then((taxi) => {
    console.log(taxi);
    res.send(taxi)
})
    .catch((error) => {
        console.log(error);
    });    
}

async function bookings_request(req, res) {
    
    var driver_id = req.userData._id;
    let driver_vehicle = await Model.User.findOne({_id:driver_id });
     if(driver_vehicle.role == 'driver'){
         let book_request = await Model.Vehicleowner.aggregate([
            {
                $match: {
                    userId: mongoose.Types.ObjectId(driver_id)
                }
            },
            {
                $lookup: {
                    from: 'bookings',
                    localField: 'vehicleType',
                    foreignField: 'carType',
                    as: 'showbooking'
    
                },
    
    
            },
    
         ]).then((book_request) => {
            console.log(book_request);
            res.send(book_request)
        })
            .catch((error) => {
                console.log(error);
            });     
        
        }  
}

async function accepted_by(req,res){
    try{
        var d_id = req.userData._id;
        let driver = await Model.User.findOne({_id:d_id});
        console.log(driver.firstName);
        let booking = await Model.booktaxi.updateOne({ _id:req.query.id}, { $set: {booking_status: 'Booked',accepted_by:driver.firstName } });
        console.log(booking);
    }
    catch (error) {
        res.status(400).send(error);
    }
} 







module.exports = {
    register: register,
    login: login,
    login_with_phone: login_with_phone,
    sendOtp: sendOtp,
    verifyOtp: verifyOtp,
    user: user,
    gettaxis: gettaxis,
    booktaxi: booktaxi,
    user_bookings: user_bookings,
    gettaxis_byuser: gettaxis_byuser,
    bookings_request:bookings_request,
    accepted_by:accepted_by
}





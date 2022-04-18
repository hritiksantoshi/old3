const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const Model = require('../../models/index');
const jwt = require("jsonwebtoken");
const universalFunction = require('../../lib/universal-function');
const Service = require('../../services/index');




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


// function for vehicle registeration

async function owner(req, res) {
    try {

        
        let logged_user = await Model.User.findOne({ _id: req.userData._id })
        console.log(logged_user);
        if(logged_user.role == "driver"){
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
    else{
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
        // // {
        // //     $project: {
        // //         vehicleName: "$taxiinfo.name",
        // //         vehicleType: "$taxiinfo.type",
        // //         image: "$image"
        // //     }
        // // }
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
        

        if(booking_user.role == "driver"){
            res.send("you_are_Not_a_user");
        }
        if(booking_user.role == "user"){
            let bookdata = req.body;
            bookdata.userId = req.userData._id; 
            let client = await Model.booktaxi(bookdata).save();
        }
    

        res.status(201);
        res.send(client);
        console.log(client);

    }
    catch (error) {
        res.status(400).send(error);
    }

}

async function user_bookings(req,res){
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
        // {
        //     $project: {
        //         Booked_by:"$user.firstName"
        //     }
        // }

    ]).then((booking) => {
        console.log(booking);
        res.send(booking)
    })
        .catch((error) => {
            console.log(error);
        });
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
const arrOfNum = [1, 2, 2, 4, 5, 6, 6];
console.log(getUniqueValues(arrOfNum));

function getUniqueValues(arrOfNum) {
    const set = new Set(arrOfNum);
    return [...set];
  }

  var arr = [4,10,1,15,2]


  let bubbleSort = (inputArr) => {
    let len = inputArr.length;
    for (let i = 0; i < len; i++) {
        for (let j = 0; j < len; j++) {
            if (inputArr[j] > inputArr[j + 1]) {
                let tmp = inputArr[j];
                inputArr[j] = inputArr[j + 1];
                inputArr[j + 1] = tmp;
            }
        }
    }
    return inputArr;
};
bubbleSort(arr);
console.log(arr);




module.exports = {
    owner: owner,
    gettaxis: gettaxis,
    booktaxi: booktaxi,
    register: register,
    login: login,
    sendOtp: sendOtp,
    verifyOtp: verifyOtp,
    login_with_phone: login_with_phone,
    user_bookings:user_bookings
}
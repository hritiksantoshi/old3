const Controller = require('./controllers/UserController');
const uploadimg = require('.././services/FileUploadService');
const Authorization = require('../policies/authorized');
const express = require('express');
const router = express.Router();
router.post('/register',uploadimg.vehicleimg.single('profilePic'), Controller.register);
router.post('/login', Controller.login);
router.post('/login_with_phone', Controller.login_with_phone);
router.post('/sendOtp', Controller.sendOtp);
router.post('/verifyOtp', Controller.verifyOtp);
router.post('/user',Authorization.userAuth,uploadimg.vehicleimg.array('image'),Controller.user);

router.post('/booktaxi',Authorization.userAuth,Controller.booktaxi);
router.get('/gettaxis',Controller.gettaxis);


router.get('/user_bookings',Authorization.userAuth,Controller.user_bookings);
module.exports = router;

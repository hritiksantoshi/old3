const Controller = require('./controllers/UserController');
const uploadimg = require('.././services/FileUploadService');
const Authorization = require('../policies/authorized');
const express = require('express');
const router = express.Router();
router.post('/register',uploadimg.vehicleimg.single('profilePic'), Controller.register);
router.post('/login', Controller.login);
router.post('/user',Authorization.userAuth,uploadimg.vehicleimg.array('image'),Controller.owner);

router.post('/booktaxi',Authorization.userAuth,Controller.booktaxi);
router.get('/gettaxis',Controller.gettaxis);
router.post('/sendOtp', Controller.sendOtp);
router.post('/verifyOtp', Controller.verifyOtp);
router.post('/login_with_phone', Controller.login_with_phone);
router.get('/user_bookings',Authorization.userAuth,Controller.user_bookings);
module.exports = router;

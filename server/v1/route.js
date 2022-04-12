const Controller = require('./controllers/UserController');
const uploadimg = require('.././services/FileUploadService');
const express = require('express');
const router = express.Router();
router.post('/register',uploadimg.vehicleimg.single('profilePic'), Controller.register);
router.post('/login', Controller.login);
router.post('/owner',uploadimg.vehicleimg.array('image'),Controller.owner);

router.post('/booktaxi',Controller.booktaxi);
router.get('/gettaxis',Controller.gettaxis);
module.exports = router;

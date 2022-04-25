const multer = require('multer');
const userUpload = multer.diskStorage({
    destination: function (req, file, cb) {
        if(file.fieldname === "profilePic"){
        cb(null, 'uploads/user')
        }else{
            cb(null, 'uploads/vehiclimages')
        }
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + `.${file.originalname.split('.').pop()}`)
    }
});

const vehicleimg = multer({ storage: userUpload });
module.exports = {
    vehicleimg: vehicleimg
};
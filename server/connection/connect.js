var mongoose = require('mongoose');
var connect = function() {
    return new Promise((resolve, reject) => {
        var url = 'mongodb://localhost:27017/old3';
        mongoose.connect(url, {useUnifiedTopology: true, useNewUrlParser: true}, (error, result) => {
            if (error) {
                console.log(error);
                return reject(error);
            }
            return resolve('Db successfully connected!');
        });
    });
};

module.exports = {
    connect: connect
};
var mongoose = require('mongoose');
var connect = function() {
    return new Promise((resolve, reject) => {
        var url = 'mongodb+srv://test:old3DB@cluster0.1uhex.mongodb.net/old3?retryWrites=true&w=majority';
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
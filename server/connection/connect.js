var mongoose = require('mongoose');
var connect = function() {
    return new Promise((resolve, reject) => {
        var url = 'mongodb+srv://root:old3DB@cluster0.1uhex.mongodb.net/myFirstDatabase?retryWrites=true&w=majority://mongodb+srv://root:root@cluster0.1uhex.mongodb.net/old3?retryWrites=true&w=majority:27017/old3';
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
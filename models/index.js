const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/ApiAuthentication', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
});

module.exports.User = require('./user');
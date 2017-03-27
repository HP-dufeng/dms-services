const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

exports.register = function (server, options, next) {
    const { uri } = options;

    mongoose.connect(uri);
    mongoose.connection
        .once('open', ()=> {
            next();
        })
        .on('error', (error) => { 
            console.error('connect error !') 
        });  
};

exports.register.attributes = {
    pkg: require('../package.json')
};
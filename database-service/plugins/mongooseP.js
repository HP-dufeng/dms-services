const mongoose = require('mongoose');
const _ = require('lodash');

mongoose.Promise = global.Promise;

function mongooseStore (options) {
    // this is the special initialization pattern
    this.add('init:mongooseStore', init)


    function init(msg, respond) {
        const { uri } = options;
        mongoose.connect(uri);
        mongoose.connection
            .once('open', ()=> {
                respond();
            })
            .on('error', (error) => { 
                console.error('connect error !') 
            });       
    }

}

module.exports = mongooseStore;
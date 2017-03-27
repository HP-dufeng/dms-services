const seneca = require('seneca')();

const mongooseStore = require('./plugins/mongooseP');

seneca.use(mongooseStore, {
    uri: 'mongodb://localhost:27017/dms'
});


seneca.add({role: "dms-store", cmd: "add"}, function(args, respond){
	
	console.log(args);
    respond();
});


seneca.listen({port: "5010", pin: {role: "dms-store"}});
const express = require('express'); 
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const config = require('./config');

mongoose.connect(config.mongodb.uri);
mongoose.Promise = global.Promise;

const routers = require('./router');

const app = express(); 

app.use(bodyParser.json());

routers(app);

app.use(function (err, req, res, next) {
    console.log(err);
    if(err.code === 'LIMIT_FILE_SIZE'){
        res.status(422).send({ error: err.message });
    } else if(err.code === 404){
        return res.status(404).send({ error: err.message });
    }
     else {
        next();
    }

})

app.listen('3000', function(){
    console.log('Server listenning on 3000...');
});
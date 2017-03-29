const express = require('express'); 
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const config = require('./config');
const GFSStorage = require('./storages/GFSStorage');

const SMStorage = require('./storages/SMStorage');

mongoose.connect(config.mongodb.uri);
mongoose.Promise = global.Promise;

const gfsStorage = new GFSStorage(config.mongodb.root);
const smsStorage = new SMStorage();

const app = express(); 

app.use(bodyParser.json());

app.post('/small/upload', smsStorage.upload, function(req, res) {
    const { filename } = req.file;
    res.json({ filename });
});

app.get('/small/file/:filename', function(req, res,next){
    const { filename } = req.params;
    smsStorage.getFile(filename)
        .then(file => {
            res.set('Content-Type', file.contentType)
            /** return response */
            return res.send(file.data);
        })
        .catch(next);
});

/** API path that will upload the files */
app.post('/upload', gfsStorage.upload, function(req, res) {
    const { filename } = req.file;
    res.json({ filename });
});

app.get('/file/:filename', function(req, res,next){
    const { filename } = req.params;
    gfsStorage.getFile(filename)
        .then(r => {
            const { file, stream  } = r;
            res.set('Content-Type', file.contentType)
            /** return response */
            return stream.pipe(res);
        })
        .catch(next);
});

app.use(function (err, req, res, next) {
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
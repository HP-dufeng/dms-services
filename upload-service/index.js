const express = require('express'); 
const bodyParser = require('body-parser');

const config = require('./config');
const GFSStorage = require('./storages/gfsStorage');

const app = express(); 

app.use(bodyParser.json());

const gfsStorage = new GFSStorage(config.mongodb.uri, config.mongodb.root);

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
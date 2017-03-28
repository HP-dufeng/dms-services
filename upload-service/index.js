const express = require('express'); 
const bodyParser = require('body-parser');
const multer = require('multer');

const GFSStorage = require('./storages/gfsStorage');

const storageObj = new GFSStorage('mongodb://localhost:27017/dms', 'ctFiles');
const { storage, gfs, root, getFile } = storageObj;

const app = express(); 

app.use(bodyParser.json());


const upload = multer({ //multer settings for single upload
    storage: storage
}).single('file');

/** API path that will upload the files */
app.post('/upload', upload, function(req, res) {
    const { filename } = req.file;
    res.json({ filename });
});

app.get('/file/:filename', function(req, res){
    const { filename } = req.params;
    storageObj.getFile(filename)
        .then(r => {
            const { file, stream  } = r;
            res.set('Content-Type', file.contentType)
            /** return response */
            return stream.pipe(res);
        })
        .catch(error => {
            if(error.message === '404')
                return res.status(404);
            
            throw error;
        });
});

app.listen('3000', function(){
    console.log('Server listenning on 3000...');
});
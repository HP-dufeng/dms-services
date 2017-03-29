const gridfs = require('./controllers/gridfsController');
const small = require('./controllers/smallController');

module.exports = app => {
    app.post('/upload', gridfs.upload);
    app.get('/file/:filename', gridfs.download);

    app.post('/small/upload', small.upload);
    app.get('/small/file/:filename', small.download);
};
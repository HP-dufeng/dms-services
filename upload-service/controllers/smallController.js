const SMStorage = require('../storages/SMStorage');

const storage = new SMStorage();

exports.upload = (req, res, next) => {
    storage.upload(req, res)
        .then(() => {
            const { filename } = req.file;
            res.json({ filename });
        })
        .catch(next);
};

exports.download = (req, res, next) => {
    const { filename } = req.params;

    storage.download(filename)
        .then(file => {
            if(!file){
                const error =  new Error('File not found');
                error.code = 404;
                throw error;
            }

            res.set('Content-Type', file.contentType)
            /** return response */
            return res.send(file.data);
        })
        .catch(next);
};
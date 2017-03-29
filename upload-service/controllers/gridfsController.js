const GFSStorage = require('../storages/GFSStorage');

const gfsStorage = new GFSStorage();

exports.upload = (req, res, next) => {
    gfsStorage.upload(req, res)
        .then(() => {
            const { filename } = req.file;
            res.json({ filename });
        })
        .catch(next);
};

exports.download = (req, res, next) => {
    const { filename } = req.params;

    gfsStorage.download(filename)
        .then(r => {
            const { file, stream  } = r;
            res.set('Content-Type', file.contentType)
            /** return response */
            return stream.pipe(res);
        })
        .catch(next);
};
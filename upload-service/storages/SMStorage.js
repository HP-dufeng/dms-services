const multer = require('multer');

const config = require('../config');
const File = require('../models/file');

const { rename } = require('./util');

class SMStorage {
    upload(req, res) {
        const upload  = multer({ 
            storage: multer.memoryStorage(),
            limits: {
                fileSize: config.mongodb.fileSizeLimit
            }
        }).single('file');

        const p = new Promise((resolve, reject) => {
            upload(req, res, err => {
                if(err) return reject(err);

                const { file } = req;

                const fileModel = new File({ 
                    filename: rename(file.originalname),
                    data: file.buffer,
                    contentType: file.mimetype,
                    length: file.size,
                    uploadDate: new Date(),
                    metadata:{
                        originalname: file.originalname
                    }
                });
                
                fileModel.save()
                    .then(() => {
                        req.file.filename = fileModel.filename;
                        resolve();
                    });
            });
        });

        return p;
    }

    download(filename) {
        return File.findOne({ filename });
    }
}

module.exports = SMStorage;
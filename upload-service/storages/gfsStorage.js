const multer = require('multer');
const mongoose = require('mongoose');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');

const { rename } = require('./util');

const root = "ctFiles";

class GFSStorage {
    constructor() {
        if(!mongoose.connection.db)
            throw new Error('You must be connect to mongodb first');

        this.storage = this.getStorage();
    }

    getStorage() {
        Grid.mongo = mongoose.mongo;
        const gfs = Grid(mongoose.connection.db);

        /** Setting up storage using multer-gridfs-storage */
        const storage = GridFsStorage({
            gfs : gfs,
            filename: function (req, file, cb) {
                const filename = rename(file.originalname);
                cb(null, filename);
            },
            /** With gridfs we can store aditional meta-data along with the file */
            metadata: function(req, file, cb) {
                cb(null, { originalname: file.originalname });
            },
            root: root //root name for collection to store files into
        });

        return storage;
    }

    upload(req, res) {
        const upload = multer({ //multer settings for single upload
            storage: this.storage
        }).single('file');
        
        const p = new Promise((resolve, reject) => {
            upload(req, res, err => {
                if(err) return reject(err);

                resolve();
            });
        });

        return p;
        
    }

    download(filename) {
        const { gfs } = this.storage;

        gfs.collection(root); //set collection name to lookup into

        /** First check if file exists */
        const p = gfs.files.find({ filename })
            .toArray()
            .then(files => {
                if(!files || files.length === 0){
                    return null;
                }

                return {
                    file: files[0],
                    stream: gfs.createReadStream({
                        filename: files[0].filename,
                        root: root
                    })
                };
        });

        return p;
    }

}

module.exports = GFSStorage;
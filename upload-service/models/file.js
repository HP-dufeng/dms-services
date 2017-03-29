const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FileSchema = new Schema({
    filename: String,
    data: Buffer,
    contentType: String,
    length: Number,
    uploadDate: Date,
    metadata:{
        originalname: String
    }
});

const File = mongoose.model('smfiles', FileSchema);

module.exports = File;
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fileSchema = new Schema({
    FullName: String
});

const FileModel = mongoose.model('file', fileSchema);

module.exports = FileModel;
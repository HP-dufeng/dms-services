const path = require('path');

const rename = function (originalname) {
    const datetimestamp = Date.now();
    const extname = path.extname(originalname);
    const filename = `${datetimestamp}${extname}`;
    
    return filename ;

};

module.exports = {
    rename
};
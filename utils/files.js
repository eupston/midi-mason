const fs = require('fs');

exports.deleteFile = (filepath) => {
    fs.unlink(filepath, function (err) {
        if (err) {
            console.log(err)
            throw err;
        }
        console.log(`${filepath} deleted!`);
    });
}
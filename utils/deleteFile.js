const path = require('path');
const fs = require('fs');

const clearFile = filePath => {
  filePath = path.join(__dirname, '..', filePath);
  fs.unlink(filePath, err => {
    if (err) {
      console.log(err);
    }
  });
};

exports.clearFile = clearFile;

const fs = require('fs');
const glob = require("glob");


const removeFile = file => {
    return new Promise((resolve, reject) => {
        fs.unlink(file, (err) => {
            err ? reject(err) : resolve(file + 'deleted');
        });
    });
};

const findFiles = filePattern => {
    return new Promise((resolve,reject) => {
        glob(filePattern, (err, files) => {
            err? reject(err) : resolve(files)
        });
    });
};


const deleteDirFilesUsingPattern = async (pattern, dirPath = __dirname) => {
    const files = await findFiles(dirPath + pattern);
    for(let file of files) {
      await removeFile(file);
      console.log(file + ' deleted!');
    }
};


module.exports.deleteDirFilesUsingPattern = deleteDirFilesUsingPattern;

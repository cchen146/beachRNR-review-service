const Json2csvParser = require('json2csv').Parser;
const fs = require('fs');
const glob = require("glob");


const writeCsvAsync = (filepath, filename, fileext, inputArr) => {
    return new Promise ((resolve, reject) => {
        let json2csvParser = new Json2csvParser();
        let csv = json2csvParser.parse(inputArr);
        let fileName = `${filepath}/${filename}.${fileext}`;
        fs.writeFile(fileName, csv, err => {
            err? reject(err) : resolve('done');
        })
    })
};

const writeCsv = (filepath, filename, fileext, inputArr, cb) => {
        let json2csvParser = new Json2csvParser();
        let csv = json2csvParser.parse(inputArr);
        let fileName = `${filepath}/${filename}.${fileext}`;
        fs.writeFile(fileName, csv, err => {
            err? cb(err, null) : cb(null, 'done');
        })
};

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


module.exports.writeCsv = writeCsv;
module.exports.deleteDirFilesUsingPattern = deleteDirFilesUsingPattern;

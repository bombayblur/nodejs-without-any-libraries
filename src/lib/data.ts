let fs = require('fs');
let path = require('path');

let lib = {};

// Base directory location
//
lib.baseDir = path.join(__dirname, '/../.data/');
// ---- X



//Create file function
//
lib.createFile = function (dir, fileName, data, callback) {

    let stringData = JSON.stringify(data);

    fs.open(lib.baseDir + '/' + dir + '/' + fileName + '.json', 'wx', (err, fd) => {
        if (err) {
            callback(err);
        } else {
            fs.writeFile(fd, stringData, {
                encoding: 'utf8'
            }, (err) => {
                if (err) {
                    callback(err);
                } else {
                    fs.close(fd, (err) => {
                        if (err) {
                            callback(err);
                        } else {
                            callback(null);
                        }
                    })
                }
            })
        }
    })
}

lib.readFile = function (dir, fileName, callback) {

    // open the file
    fs.open(path.join(lib.baseDir, dir, fileName) + '.json', (err, fd) => {

        if (err) {
            callback(err);
        } else {

            //Read the file
            fs.readFile(fd, {
                encoding: 'utf8'
            }, (err, data) => {

                if (err) {
                    callback(err);
                } else {
                    callback(null, data);
                }

                // Close the file
                fs.close(fd, (err) => {
                    if(err){
                        callback(err);
                    }
                })
            })
        }
    })
}


lib.createDir = function (dirName, callback) {

    fs.stat(path.join(lib.baseDir, dirName), (err, stats) => {
        if (stats.isDirectory()) {
            callback(Error('file already exists'))
        } else {
            fs.mkdir(path.join(lib.baseDir, dirName), {
                recursive: false
            }, (err) => {
                if (err) {
                    callback(err);
                }
            });
        }
    })

}

lib.updateFile = function (dir, file, data, callback) {
    fs.open(path.join(lib.baseDir, dir, file) + '.json', 'r+', (err, fd) => {
        if (err) {
            callback(err);
        } else {
            fs.truncate(path.join(lib.baseDir, dir, file) + '.json', 2, (err) => {
                if (err) {
                    callback(err);
                } else {
                    fs.writeFile(fd, JSON.stringify(data), {
                        encoding: 'utf8',
                        flag: 'w+'
                    }, (err) => {
                        if (err) {
                            callback(err);
                        } else {
                            fs.close(fd, (err) => {
                                callback(err);
                            })
                        }

                    })
                }
            })
        }
    })
}

lib.deleteFile = function(dir, file, callback){
    fs.unlink(path.join(lib.baseDir, dir, file)+'.json', (err)=>{
        
            callback(err);
        
    })
}

module.exports = lib;






//Read file function

//Appenf file function
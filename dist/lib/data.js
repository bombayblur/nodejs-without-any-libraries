"use strict";
var fs = require('fs');
var path = require('path');
var lib = {};
// Base directory location
//
lib.baseDir = path.join(__dirname, '/../.data/');
// ---- X
//Create file function
//
lib.createFile = function (dir, fileName, data, callback) {
    var stringData = JSON.stringify(data);
    fs.open(lib.baseDir + '/' + dir + '/' + fileName + '.json', 'wx', function (err, fd) {
        if (err) {
            callback(err);
        }
        else {
            fs.writeFile(fd, stringData, {
                encoding: 'utf8'
            }, function (err) {
                if (err) {
                    callback(err);
                }
                else {
                    fs.close(fd, function (err) {
                        if (err) {
                            callback(err);
                        }
                        else {
                            callback(null);
                        }
                    });
                }
            });
        }
    });
};
lib.readFile = function (dir, fileName, callback) {
    // open the file
    fs.open(path.join(lib.baseDir, dir, fileName) + '.json', function (err, fd) {
        if (err) {
            callback(err);
        }
        else {
            //Read the file
            fs.readFile(fd, {
                encoding: 'utf8'
            }, function (err, data) {
                if (err) {
                    callback(err);
                }
                else {
                    callback(null, data);
                }
                // Close the file
                fs.close(fd, function (err) {
                    if (err) {
                        callback(err);
                    }
                });
            });
        }
    });
};
lib.createDir = function (dirName, callback) {
    fs.stat(path.join(lib.baseDir, dirName), function (err, stats) {
        if (stats.isDirectory()) {
            callback(Error('file already exists'));
        }
        else {
            fs.mkdir(path.join(lib.baseDir, dirName), {
                recursive: false
            }, function (err) {
                if (err) {
                    callback(err);
                }
            });
        }
    });
};
lib.updateFile = function (dir, file, data, callback) {
    fs.open(path.join(lib.baseDir, dir, file) + '.json', 'r+', function (err, fd) {
        if (err) {
            callback(err);
        }
        else {
            fs.truncate(path.join(lib.baseDir, dir, file) + '.json', 2, function (err) {
                if (err) {
                    callback(err);
                }
                else {
                    fs.writeFile(fd, JSON.stringify(data), {
                        encoding: 'utf8',
                        flag: 'w+'
                    }, function (err) {
                        if (err) {
                            callback(err);
                        }
                        else {
                            fs.close(fd, function (err) {
                                callback(err);
                            });
                        }
                    });
                }
            });
        }
    });
};
lib.deleteFile = function (dir, file, callback) {
    fs.unlink(path.join(lib.baseDir, dir, file) + '.json', function (err) {
        callback(err);
    });
};
module.exports = lib;
//Read file function
//Appenf file function

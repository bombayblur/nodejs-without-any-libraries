"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var helpers_1 = __importDefault(require("./helpers"));
var FileOperations = /** @class */ (function () {
    function FileOperations() {
        this.baseDir = path_1.default.join(__dirname, '/../.data/');
    }
    FileOperations.prototype.createFile = function (dir, fileName, data, callback) {
        var stringData = JSON.stringify(data);
        fs_1.default.open(this.baseDir + '/' + dir + '/' + fileName + '.json', 'wx', function (err, fd) {
            if (err) {
                callback(err);
            }
            else {
                fs_1.default.writeFile(fd, stringData, {
                    encoding: 'utf8'
                }, function (err) {
                    if (err) {
                        callback(err);
                    }
                    else {
                        fs_1.default.close(fd, function (err) {
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
    FileOperations.prototype.readFile = function (dir, fileName, callback) {
        // open the file
        fs_1.default.open(path_1.default.join(this.baseDir, dir, fileName) + '.json', 'r+', function (err, fd) {
            if (err) {
                callback(err);
            }
            else {
                //Read the file
                fs_1.default.readFile(fd, { encoding: 'utf8' }, function (err, data) {
                    if (err) {
                        callback(err);
                    }
                    else {
                        callback(null, helpers_1.default.parseToJson(data, function (err) { return callback(err); }));
                    }
                    // Close the file
                    fs_1.default.close(fd, function (err) {
                        if (err) {
                            callback(err);
                        }
                    });
                });
            }
        });
    };
    FileOperations.prototype.updateFile = function (dir, file, data, callback) {
        var _this = this;
        fs_1.default.open(path_1.default.join(this.baseDir, dir, file) + '.json', 'r+', function (err, fd) {
            if (err) {
                callback(err);
            }
            else {
                fs_1.default.truncate(path_1.default.join(_this.baseDir, dir, file) + '.json', 2, function (err) {
                    if (err) {
                        callback(err);
                    }
                    else {
                        fs_1.default.writeFile(fd, JSON.stringify(data), {
                            encoding: 'utf8',
                            flag: 'w+'
                        }, function (err) {
                            if (err) {
                                callback(err);
                            }
                            else {
                                fs_1.default.close(fd, function (err) {
                                    callback(err);
                                });
                            }
                        });
                    }
                });
            }
        });
    };
    FileOperations.prototype.deleteFile = function (dir, file, callback) {
        fs_1.default.unlink(path_1.default.join(this.baseDir, dir, file) + '.json', function (err) {
            callback(err);
        });
    };
    return FileOperations;
}());
exports.default = new FileOperations;
//# sourceMappingURL=data.js.map
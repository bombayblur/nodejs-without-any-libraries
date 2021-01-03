"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var userModel_1 = require("../models/userModel");
var data_1 = __importDefault(require("../data"));
var tokenController_1 = __importDefault(require("./tokenController"));
var UsersController = /** @class */ (function () {
    function UsersController() {
    }
    UsersController.prototype.post = function (data, callback) {
        var dataObject = data.payload;
        var user = new userModel_1.User(dataObject.firstName, dataObject.lastName, dataObject.phoneNumber, dataObject.password, dataObject.email, dataObject.tos);
        if (user.validateCompleteUser()) {
            user.hashPassword();
            data_1.default.readFile('users', user.phoneNumber.toString(), function (err, data) {
                if (err) {
                    data_1.default.createFile('users', user.phoneNumber.toString(), user, function (err) {
                        if (!err) {
                            delete user.password;
                            callback(200, { message: user });
                        }
                        else if (err) {
                            callback(500, { error: "Unable to create user. Here is the full message: " + err.message });
                        }
                    });
                }
                else {
                    callback(400, { error: 'User may already Exist' });
                }
            });
        }
        else {
            callback(400, { error: 'Incomplete Data' });
        }
    };
    UsersController.prototype.get = function (data, callback) {
        var queryString = data.queryString;
        if (queryString.phonenumber && queryString.phonenumber.length == 10) {
            data_1.default.readFile('users', queryString.phonenumber, function (err, dataToShip) {
                if (err) {
                    callback(400, { error: 'User Probably not found.' + err.message });
                }
                else {
                    delete dataToShip.password;
                    // Verify the incoming request and only then serve.
                    var headerToken = data.header.token;
                    tokenController_1.default.verifyToken(headerToken, dataToShip.phoneNumber, function (err) {
                        if (!err) {
                            callback(200, { message: dataToShip });
                        }
                        else {
                            callback(400, { error: err.message });
                        }
                    });
                }
            });
        }
        else {
            callback(400, { error: 'Invalid phone number' });
        }
    };
    UsersController.prototype.put = function (data, callback) {
        var phoneNumber = data.queryString.phonenumber;
        if (typeof (phoneNumber) == 'string' && phoneNumber.length == 10) {
            var dataObject = data.payload;
            var updateObject_1 = new userModel_1.User(dataObject.firstName, dataObject.lastName, dataObject.phoneNumber, dataObject.password, dataObject.email, dataObject.tos);
            if (updateObject_1.validatePartialUser()) {
                data_1.default.readFile('users', phoneNumber, function (err, userObject) {
                    if (err) {
                        callback(400, { error: 'User probably doesn\'t exit. ' + err.message });
                    }
                    else {
                        var newObj = Object.assign(userObject, updateObject_1);
                        var headerToken = data.header.token;
                        tokenController_1.default.verifyToken(headerToken, userObject.phoneNumber, function (err) {
                            if (!err) {
                                data_1.default.updateFile('users', phoneNumber, userObject, function (err) {
                                    if (err) {
                                        callback(500, { error: 'Couldn\'t update user' + err.message });
                                    }
                                    else {
                                        callback(200, { message: userObject.phoneNumber + ' has been updated' });
                                    }
                                });
                            }
                            else {
                                callback(400, { error: err.message });
                            }
                        });
                    }
                });
            }
        }
        else {
            callback(400, { error: 'Invalid Phone Number' });
        }
    };
    // @TODO Delete all checks
    UsersController.prototype.delete = function (data, callback) {
        var headerToken = data.header.token;
        var phoneNumber = data.queryString.phonenumber;
        if (typeof (phoneNumber) == 'string' && phoneNumber.length == 10 && headerToken && headerToken.length == 20) {
            data_1.default.readFile('users', phoneNumber, function (err, userObject) {
                if (err) {
                    callback(400, { error: 'User doesnt exist' });
                }
                else {
                    tokenController_1.default.verifyToken(headerToken, userObject.phoneNumber, function (err) {
                        if (!err) {
                            var checksToDelete = userObject.checks;
                            var checkDeleteErrors_1 = [];
                            var _loop_1 = function (check) {
                                data_1.default.deleteFile('checks', check, function (err) {
                                    if (err) {
                                        checkDeleteErrors_1.push({ check: check, error: err.message });
                                    }
                                });
                            };
                            for (var _i = 0, _a = checksToDelete; _i < _a.length; _i++) {
                                var check = _a[_i];
                                _loop_1(check);
                            }
                            if (checkDeleteErrors_1.length > 0) {
                                var message = JSON.stringify(checkDeleteErrors_1);
                                callback(500, { error: message });
                            }
                            else {
                                data_1.default.deleteFile('users', phoneNumber, function (err) {
                                    if (err) {
                                        callback(500, { error: 'User wasn\'t deleted' });
                                    }
                                    callback(200, { message: phoneNumber + ' was deleted' });
                                });
                            }
                        }
                        else {
                            callback(400, { error: err.message });
                        }
                    });
                }
            });
        }
        else {
            callback(400, { error: 'Incomplete Credentials or info supplied' });
        }
    };
    return UsersController;
}());
exports.default = new UsersController;
//# sourceMappingURL=userControlller.js.map
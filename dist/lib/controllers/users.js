"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var models_1 = require("../models");
var helpers_1 = __importDefault(require("../helpers"));
var data_1 = __importDefault(require("../data"));
var UsersController = /** @class */ (function () {
    function UsersController() {
        this.delete = function (data, callback) {
            var headerToken = data.header.token;
            var phoneNumber = data.queryString.phonenumber;
            if (typeof (phoneNumber) == 'string' && phoneNumber.length == 10 && headerToken.length == 20) {
                data_1.default.readFile('users', phoneNumber, function (err, readData) {
                    if (err) {
                        callback(400, { error: 'User doesn\'t exist' });
                    }
                    else {
                        var userObject_1 = helpers_1.default.parseToJson(readData, function (err) { return callback(500, { error: err.message }); });
                        handler._tokens.verifyToken(headerToken, userObject_1.phoneNumber, function (err) {
                            if (!err) {
                                data_1.default.deleteFile('users', phoneNumber, function (err) {
                                    if (err) {
                                        callback(500, { error: 'User wasn\'t deleted' });
                                    }
                                    callback(200, { message: phoneNumber + ' was deleted' });
                                });
                            }
                            else {
                                callback(400, { error: err.message + headerToken + userObject_1.phoneNumber });
                            }
                        });
                    }
                });
            }
        };
    }
    UsersController.prototype.post = function (data, callback) {
        var dataObject = data.payload;
        var user = new models_1.User(dataObject.firstName, dataObject.lastName, dataObject.phoneNumber, dataObject.password, dataObject.email, dataObject.tos);
        if (user.validateCompleteUser()) {
            data_1.default.readFile('users', user.phoneNumber.toString(), function (err, data) {
                if (err) {
                    data_1.default.createFile('users', user.phoneNumber.toString(), user, function (err) {
                        if (!err) {
                            delete user.password;
                            callback(200, user);
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
            data_1.default.readFile('users', queryString.phonenumber, function (err, storeData) {
                if (err) {
                    callback(400, { error: 'User Probably not found.' + err.message });
                }
                else {
                    var dataToShip_1 = helpers_1.default.parseToJson(storeData, function (err) { return callback(500, { error: err.message }); });
                    delete dataToShip_1.password;
                    // Verify the incoming request and only then serve.
                    var headerToken = data.header.token;
                    handler._tokens.verifyToken(headerToken, dataToShip_1.phoneNumber.toString(), function (err) {
                        if (!err) {
                            callback(200, dataToShip_1);
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
            var updateObject_1 = new models_1.User(dataObject.firstName, dataObject.lastName, dataObject.phoneNumber, dataObject.password, dataObject.email, dataObject.tos);
            if (updateObject_1.validatePartialUser()) {
                data_1.default.readFile('users', phoneNumber, function (err, readData) {
                    if (err) {
                        callback(400, { error: 'User probably doesn\'t exit. ' + err.message });
                    }
                    else {
                        var userObject_2 = helpers_1.default.parseToJson(readData, function (err) { return callback(500, { error: err.message }); });
                        Object.assign(userObject_2, updateObject_1);
                        // Verify the incoming request and only then serve.
                        var headerToken = data.header.token;
                        handler._tokens.verifyToken(headerToken, userObject_2.phoneNumber, function (err) {
                            if (!err) {
                                data_1.default.updateFile('users', phoneNumber, userObject_2, function (err) {
                                    if (err) {
                                        callback(500, { error: 'Couldn\'t update user' + err.message });
                                    }
                                    else {
                                        callback(200, { message: userObject_2.phoneNumber + ' has been updated' });
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
    return UsersController;
}());
exports.default = new UsersController;

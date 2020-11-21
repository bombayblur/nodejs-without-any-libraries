"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var models_1 = require("../models");
var helpers_1 = __importDefault(require("../helpers"));
var data_1 = __importDefault(require("../data"));
var TokensController = /** @class */ (function () {
    function TokensController() {
    }
    TokensController.prototype.post = function (data, callback) {
        var payload = data.payload;
        var tokenRequest = new models_1.TokenRequest(payload.phoneNumber, payload.password);
        if (tokenRequest.validateRequest()) {
            data_1.default.readFile('users', tokenRequest.phoneNumber.toString(), function (err, data) {
                if (err) {
                    callback(400, { error: 'User not found' });
                }
                else {
                    var userData = helpers_1.default.parseToJson(data, function (err) { return callback(500, { error: 'Parsing Failure' }); });
                    //check if the credentials supplied match
                    if (userData.password == tokenRequest.hashedPassword) {
                        //create a token object
                        var token_1 = tokenRequest.generateToken();
                        data_1.default.createFile('tokens', token_1.id, token_1, function (err) {
                            if (!err) {
                                callback(200, token_1);
                            }
                            else {
                                callback(500, { error: 'Failled to create a token.' });
                            }
                        });
                    }
                }
            });
        }
        else {
            callback(400, { error: 'Could not validate credentials.' });
        }
    };
    // Take id of token from query string and send back the token
    TokensController.prototype.get = function (data, callback) {
        var id = typeof (data.queryString.id) == 'string' && data.queryString.id.trim().length == 20 ? data.queryString.id.trim() : false;
        if (id) {
            data_1.default.readFile('tokens', id, function (err, data) {
                if (err) {
                    callback(404, { error: 'Token not found.' });
                }
                else {
                    var storedToken = helpers_1.default.parseToJson(data, function (err) { return callback(500, { error: 'Parsing Failure' }); });
                    if (storedToken.expiry <= Date.now()) {
                        callback(400, { error: 'Token has expired, please request new token' });
                    }
                    else {
                        callback(200, storedToken);
                    }
                }
            });
        }
        else {
            callback(400, { error: 'Incomplete Query' });
        }
    };
    // Take id of token, check if it has expired and then issue a new token 
    TokensController.prototype.put = function (data, callback) {
        var id = typeof (data.queryString.id) == 'string' && data.queryString.id.trim().length == 20 ? data.queryString.id.trim() : false;
        var extend = data.queryString.extend;
        if (id && extend) {
            data_1.default.readFile('tokens', id, function (err, data) {
                if (err) {
                    callback(404, { error: 'Token not found.' });
                }
                else {
                    var token_2 = helpers_1.default.parseToJson(data, function (err) { return callback(500, { error: 'Parsing Failure' }); });
                    if (token_2.expiry <= Date.now()) {
                        callback(400, { error: 'Token has expired, please request new token' });
                    }
                    else {
                        token_2.expiry = Date.now() + (3600000);
                        data_1.default.updateFile('tokens', id, token_2, function (err) {
                            if (err) {
                                callback(500, { error: 'Failled to create new Token' });
                            }
                            else {
                                callback(200, token_2);
                            }
                        });
                    }
                }
            });
        }
        else {
            callback(400, { error: 'Incomplete Query' });
        }
    };
    // Take id of token and dele
    TokensController.prototype.delete = function (data, callback) {
        var id = typeof (data.queryString.id) == 'string' && data.queryString.id.trim().length == 20 ? data.queryString.id.trim() : false;
        if (id) {
            data_1.default.readFile('tokens', id, function (err, data) {
                if (err) {
                    callback(404, { error: 'Token not found.' });
                }
                else {
                    data_1.default.deleteFile('tokens', id, function (err) {
                        if (err) {
                            callback(500, { error: 'Token could not be deleted' });
                        }
                        else {
                            callback(200, { message: 'Token succesfully deleted' });
                        }
                    });
                }
            });
        }
        else {
            callback(400, { error: 'Incomplete Query' });
        }
    };
    // Whenever someone wants to get, put or delete one has to supply the token in the header.
    // The token will be validated against the entry we are performing the operation on.
    // If this function returns true we proceed else we dont.
    TokensController.prototype.verifyToken = function (id, phone, callback) {
        if (typeof (id) == 'string' && id.trim().length == 20) {
            data_1.default.readFile('tokens', id, function (err, data) {
                if (err) {
                    callback(Error('Token not found.'));
                }
                else {
                    var userObject = helpers_1.default.parseToJson(data, function (err) { return callback(Error("Parse Error")); });
                    if (userObject.phoneNumber == phone) {
                        callback(null);
                    }
                    else {
                        callback(Error("Access Denied"));
                    }
                }
            });
        }
        else {
            callback(Error('Improper headers set/no token supplied'));
        }
    };
    return TokensController;
}());

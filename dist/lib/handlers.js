"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var helpers = require('./helpers');
var dataLib = require('./data');
var handler = {};
handler.ping = function (data, callback) {
    callback(200);
};
handler.notFound = function (data, callback) {
    callback(404, {
        'message': 'Looks like its a 404'
    });
};
handler.users = function (data, callback) {
    var acceptableMethods = ['get', 'post', 'put', 'delete'];
    if (acceptableMethods.indexOf(data.method) == -1) {
        callback(500, {
            'message': 'Unacceptable Method sent'
        });
    }
    else {
        handler._users[data.method](data, callback);
    }
};
handler._users = {};
handler._users.post = function (data, callback) {
    var dataObject = data.payload;
    var user = {};
    user.firstName = typeof (dataObject.firstName) == 'string' && dataObject.firstName.trim().length > 0 && dataObject.firstName;
    user.lastName = typeof (dataObject.lastName) == 'string' && dataObject.lastName.trim().length > 0 && dataObject.lastName;
    user.phoneNumber = typeof (dataObject.phoneNumber) == 'number' && dataObject.phoneNumber.toString().trim().length == 10 && dataObject.phoneNumber;
    user.password = typeof (dataObject.password) == 'string' && dataObject.password.trim().length > 8 && helpers.hashPassword(dataObject.password);
    user.email = typeof (dataObject.email) == 'string' && dataObject.email.trim().length > 6 && dataObject.email;
    user.tos = typeof (dataObject.tos) == 'boolean' && dataObject.tos == true && dataObject.tos;
    if (user.firstName && user.lastName && user.email && user.phoneNumber && user.password && user.tos) {
        dataLib.readFile('users', user.phoneNumber.toString(), function (err, data) {
            if (err) {
                dataLib.createFile('users', user.phoneNumber, user, function (err) {
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
handler._users.get = function (data, callback) {
    var queryString = data.queryString;
    if (queryString.phonenumber && queryString.phonenumber.length == 10) {
        dataLib.readFile('users', queryString.phonenumber, function (err, storeData) {
            if (err) {
                callback(400, { error: 'User Probably not found.' + err.message });
            }
            else {
                var dataToShip_1 = helpers.parseToJson(storeData, function (err) { return callback(500, { error: err.message }); });
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
handler._users.put = function (data, callback) {
    var phoneNumber = data.queryString.phonenumber && data.queryString.phonenumber.length == 10 && data.queryString.phonenumber;
    if (phoneNumber) {
        var updateObject_1 = {};
        if (data.payload.firstName) {
            updateObject_1.firstName = typeof (data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 && data.payload.firstName;
        }
        if (data.payload.lastName) {
            updateObject_1.lastName = typeof (data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 && data.payload.lastName;
        }
        if (data.payload.phoneNumber) {
            updateObject_1.phoneNumber = typeof (data.payload.phoneNumber) == 'number' && data.payload.phoneNumber.toString().trim().length == 10 && data.payload.phoneNumber;
        }
        if (data.payload.email) {
            updateObject_1.email = typeof (data.payload.email) == 'string' && data.payload.email.trim().length > 6 && data.payload.email;
        }
        if (data.payload.password) {
            updateObject_1.password = typeof (data.payload.password) == 'string' && data.payload.password.trim().length > 8 && helpers.hashPassword(data.payload.password);
        }
        dataLib.readFile('users', phoneNumber, function (err, readData) {
            if (err) {
                callback(400, { error: 'User probably doesn\'t exit. ' + err.message });
            }
            else {
                var userObject_1 = helpers.parseToJson(readData, function (err) { return callback(500, { error: err.message }); });
                Object.assign(userObject_1, updateObject_1);
                // Verify the incoming request and only then serve.
                var headerToken = data.header.token;
                handler._tokens.verifyToken(headerToken, userObject_1.phoneNumber, function (err) {
                    if (!err) {
                        dataLib.updateFile('users', phoneNumber, userObject_1, function (err) {
                            if (err) {
                                callback(500, { error: 'Couldn\'t update user' + err.message });
                            }
                            else {
                                callback(200, { message: userObject_1.phoneNumber + ' has been updated' });
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
    else {
        callback(400, { error: 'Invalid Phone Number' });
    }
};
handler._users.delete = function (data, callback) {
    var phoneNumber = data.queryString.phonenumber && data.queryString.phonenumber.length == 10 && data.queryString.phonenumber;
    var headerToken = data.header.token;
    dataLib.readFile('users', phoneNumber, function (err, readData) {
        if (err) {
            callback(400, { error: 'User doesn\'t exist' });
        }
        else {
            var userObject_2 = helpers.parseToJson(readData, function (err) { return callback(500, { error: err.message }); });
            handler._tokens.verifyToken(headerToken, userObject_2.phoneNumber, function (err) {
                if (!err) {
                    dataLib.deleteFile('users', phoneNumber, function (err) {
                        if (err) {
                            callback(500, { error: 'User wasn\'t deleted' });
                        }
                        callback(200, { message: phoneNumber + ' was deleted' });
                    });
                }
                else {
                    callback(400, { error: err.message + headerToken + userObject_2.phoneNumber });
                }
            });
        }
    });
};
handler.tokens = function (data, callback) {
    var acceptableMethods = ['get', 'post', 'put', 'delete'];
    if (acceptableMethods.indexOf(data.method) == -1) {
        callback(500, {
            'message': 'Unacceptable Method sent'
        });
    }
    else {
        handler._tokens[data.method](data, callback); // Callback here stands for a funciton call, so don't confuse.
    }
};
handler._tokens = {};
// Take phone and password, verify, then generate a token
handler._tokens.post = function (data, callback) {
    var payload = data.payload;
    var phoneNumber = typeof (payload.phoneNumber) == 'number' && payload.phoneNumber.toString().trim().length == 10 && payload.phoneNumber.toString();
    var password = typeof (payload.password) == 'string' && payload.password.trim().length > 8 && helpers.hashPassword(payload.password);
    if (phoneNumber && password) {
        var credObject_1 = {};
        credObject_1.password = password;
        credObject_1.phoneNumber = phoneNumber;
        dataLib.readFile('users', phoneNumber, function (err, data) {
            if (err) {
                callback(400, { error: 'User not found' });
            }
            else {
                var userData = helpers.parseToJson(data, function (err) { return callback(500, { error: 'Parsing Failure' }); });
                //check if the credentials supplied match
                if (userData.password == credObject_1.password) {
                    //create a token object
                    var token_1 = {};
                    token_1.id = helpers.genRandString(20);
                    token_1.phoneNumber = phoneNumber;
                    token_1.expiry = Date.now() + (1000 * 60 * 60);
                    dataLib.createFile('tokens', token_1.id, token_1, function (err) {
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
handler._tokens.get = function (data, callback) {
    var id = typeof (data.queryString.id) == 'string' && data.queryString.id.trim().length == 20 ? data.queryString.id.trim() : false;
    if (id) {
        dataLib.readFile('tokens', id, function (err, data) {
            if (err) {
                callback(404, { error: 'Token not found.' });
            }
            else {
                var storedToken = helpers.parseToJson(data, function (err) { return callback(500, { error: 'Parsing Failure' }); });
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
handler._tokens.put = function (data, callback) {
    var id = typeof (data.queryString.id) == 'string' && data.queryString.id.trim().length == 20 ? data.queryString.id.trim() : false;
    var extend = data.queryString.extend;
    if (id && extend) {
        dataLib.readFile('tokens', id, function (err, data) {
            if (err) {
                callback(404, { error: 'Token not found.' });
            }
            else {
                var token_2 = helpers.parseToJson(data, function (err) { return callback(500, { error: 'Parsing Failure' }); });
                if (token_2.expiry <= Date.now()) {
                    callback(400, { error: 'Token has expired, please request new token' });
                }
                else {
                    token_2.expiry = Date.now() + (3600000);
                    dataLib.updateFile('tokens', id, token_2, function (err) {
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
handler._tokens.delete = function (data, callback) {
    var id = typeof (data.queryString.id) == 'string' && data.queryString.id.trim().length == 20 ? data.queryString.id.trim() : false;
    if (id) {
        dataLib.readFile('tokens', id, function (err, data) {
            if (err) {
                callback(404, { error: 'Token not found.' });
            }
            else {
                dataLib.deleteFile('tokens', id, function (err) {
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
handler._tokens.verifyToken = function (id, phone, callback) {
    if (typeof (id) == 'string' && id.trim().length == 20) {
        dataLib.readFile('tokens', id, function (err, data) {
            if (err) {
                callback(Error('Token not found.'));
            }
            else {
                var userObject = helpers.parseToJson(data, function (err) { return callback(Error("Parse Error")); });
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
handler.checks = function (data, callback) {
    var acceptableMethods = ['get', 'post', 'put', 'delete'];
    if (acceptableMethods.indexOf(data.method) == -1) {
        callback(500, {
            'message': 'Unacceptable Method sent'
        });
    }
    else {
        handler._checks[data.method](data, callback); // Callback here stands for a funciton call, so don't confuse.
    }
};
handler._checks = {};
handler._checks.post = function (data, callback) {
    var statusCodes = typeof (data.payload.statusCodes) == 'object' && data.payload.statusCodes instanceof Array && data.payload.statusCodes.length > 0 && data.payload.statusCodes.every(function (val) { return val.toString().length == 3; }) && data.payload.stausCodes;
    var protocol = typeof (data.payload.statusCodes) == 'string' && ['https', 'http'].indexOf(data.payload.protcol) > -1 && data.payload.protocol;
    var method = typeof (data.payload.method) == 'string' && ['get', 'post', 'put', 'delete'].indexOf(data.payload.method) > -1 && data.payload.method;
    var url = typeof (data.paload.url) == 'string' && data.payload.url.trinm().length > 0 && data.payload.url;
    var timeout = typeof (data.payload.timeout) == 'number' && data.payload.timeout > 1 && data.payload.timeout < 5 && data.payload.timeout % 1 == 0 && data.payload.timeout;
    // Form a checks object, complete with ID
    // Using the Id from the header, pull out the phone number of the concerned user
    // If that is succesfull and we have a read on the user, then extract the user object and check how many checks the person has if/any, but not exceeding 5.
    // Once that is established then append the ID to the user.checks list
    // File Update user and Create the checks object in the checks directory.
    if (statusCodes && protocol && method && url && timeout) {
        var checkObject = {
            'statusCodes': statusCodes,
            'protocol': protocol,
        };
    }
    else {
        callback(400, { error: 'Incomplete Data' });
    }
};
exports.default = handler;

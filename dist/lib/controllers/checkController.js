"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var checkModel_1 = require("../models/checkModel");
var data_1 = __importDefault(require("../data"));
var tokenController_1 = __importDefault(require("./tokenController"));
var ChecksController = /** @class */ (function () {
    function ChecksController() {
    }
    ChecksController.prototype.post = function (data, callback) {
        var dataObject = data.payload;
        var headerObject = data.header;
        var checksRequest = new checkModel_1.ChecksRequest(dataObject.statusCodes, dataObject.protocol, dataObject.method.toLowerCase(), dataObject.url, dataObject.timeout);
        if (checksRequest.validateCompleteChecksRequest() && headerObject.token) {
            // Find the user that is trying to create this check from the token;
            data_1.default.readFile('tokens', headerObject.token, function (err, tokenData) {
                if (err) {
                    callback(400, { error: "Invalid Token Supplied" });
                }
                else {
                    if (tokenData.expiry < Date.now()) {
                        callback(400, { error: "Expired Token, Please request new Token" });
                    }
                    else {
                        data_1.default.readFile('users', tokenData.phoneNumber.toString(), function (err, userData) {
                            if (err) {
                                callback(500, { error: "Could not find or load the user" });
                            }
                            else {
                                if (userData.checks.length >= 5) {
                                    callback(400, { error: "User has exceeded checks limit" });
                                }
                                else {
                                    userData.checks.push(checksRequest.id);
                                    checksRequest.phoneNumber = userData.phoneNumber;
                                    data_1.default.createFile('checks', checksRequest.id, checksRequest, function (err) {
                                        if (err) {
                                            callback(500, { error: "Failure to create ChecksObject" });
                                        }
                                        else {
                                            data_1.default.updateFile('users', userData.phoneNumber.toString(), userData, function (err) {
                                                if (err) {
                                                    callback(500, { error: "Failure to update user" });
                                                }
                                                else {
                                                    callback(200, { message: checksRequest });
                                                }
                                            });
                                        }
                                    });
                                }
                            }
                        });
                    }
                }
            });
        }
        else {
            callback(400, { error: "Invalid paramaetes supplied for checks request" });
        }
    };
    ChecksController.prototype.get = function (data, callback) {
        var token = data.header.token;
        var checkId = data.queryString.check;
        if (token.length == 20 && checkId.length == 20) {
            data_1.default.readFile('checks', checkId, function (err, checksData) {
                if (err) {
                    callback(400, { error: "No such check exists or unable to read database." });
                }
                else {
                    tokenController_1.default.verifyToken(token, checksData.phoneNumber, function (err) {
                        if (err) {
                            callback(400, { error: "Invalid token supplied" });
                        }
                        else {
                            callback(200, { message: checksData });
                        }
                    });
                }
            });
        }
        else {
            callback(400, { error: "Improper Headers or Query Parameters" });
        }
    };
    ChecksController.prototype.put = function (data, callback) {
        var token = data.header.token;
        var checkId = data.queryString.check;
        var body = data.payload;
        var newCheckUpdateData = new checkModel_1.ChecksRequest(body.statusCodes, body.protocol, body.method, body.url, body.timeout);
        if (token.length == 20 && checkId.length == 20 && newCheckUpdateData.validatePartialChecksRequests()) {
            data_1.default.readFile('checks', checkId, function (err, oldChecksData) {
                if (err) {
                    callback(400, { error: "No such check exists or unable to read database." });
                }
                else {
                    tokenController_1.default.verifyToken(token, oldChecksData.phoneNumber, function (err) {
                        if (err) {
                            callback(400, { error: "Invalid token supplied" });
                        }
                        else {
                            Object.assign(oldChecksData, newCheckUpdateData);
                            data_1.default.updateFile('checks', checkId, oldChecksData, function (err) {
                                if (err) {
                                    callback(500, { error: "Failled to update Checks Data" });
                                }
                                else {
                                    callback(200, { message: oldChecksData });
                                }
                            });
                        }
                    });
                }
            });
        }
    };
    ChecksController.prototype.delete = function (data, callback) {
        var token = data.header.token;
        var checkId = data.queryString.check;
        if (token.length == 20 && checkId.length == 20) {
            data_1.default.readFile('checks', checkId, function (err, checksData) {
                if (err) {
                    callback(400, { error: "No such check exists or unable to read database." });
                }
                else {
                    tokenController_1.default.verifyToken(token, checksData.phoneNumber, function (err) {
                        if (err) {
                            callback(400, { error: "Invalid token supplied" });
                        }
                        else {
                            data_1.default.readFile('users', checksData.phoneNumber.toString(), function (err, userData) {
                                if (err) {
                                    callback(500, { error: "Could not access user to delete check" });
                                }
                                else {
                                    userData.checks = userData.checks.filter(function (element) { return element !== checksData.id; });
                                    data_1.default.updateFile('users', checksData.phoneNumber.toString(), userData, function (err) {
                                        if (err) {
                                            callback(500, { error: "Could not update user data while deleting a check" });
                                        }
                                        else {
                                            data_1.default.deleteFile('checks', checkId, function (err) {
                                                if (err) {
                                                    callback(500, { error: "Could not delete the check" });
                                                }
                                                else {
                                                    callback(200, { message: checkId + " was succesfully deleted" });
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
        else {
            callback(400, { error: "Improper Headers or Query Parameters" });
        }
    };
    return ChecksController;
}());
exports.default = new ChecksController();
//# sourceMappingURL=checkController.js.map
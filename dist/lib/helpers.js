"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var crypto_1 = __importDefault(require("crypto"));
var config_1 = __importDefault(require("../config"));
var helpers = {};
helpers.parseToJson = function (string, callback) {
    try {
        return JSON.parse(string);
    }
    catch (err) {
        callback(err);
    }
};
helpers.hashPassword = function (string) {
    return crypto_1.default.createHmac('sha256', config_1.default.secretPhrase).update(string).digest('hex');
};
helpers.genRandString = function (length) {
    var possibleCharachters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    var result = '';
    for (var i = 0; i < length; i++) {
        result += possibleCharachters.charAt(Math.floor(Math.random() * possibleCharachters.length));
    }
    return result;
};
exports.default = helpers;
//# sourceMappingURL=helpers.js.map
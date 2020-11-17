"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var crypto = require('crypto');
var config = require('../config.js');
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
    return crypto.createHmac('sha256', config.secretPhrase).update(string).digest('hex');
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

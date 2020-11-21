"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var userControlller_1 = __importDefault(require("./controllers/userControlller"));
var tokenController_1 = __importDefault(require("./controllers/tokenController"));
var checkController_1 = __importDefault(require("./controllers/checkController"));
var Handler = /** @class */ (function () {
    function Handler() {
    }
    Handler.prototype.ping = function (_, callback) {
        callback(200, {});
    };
    Handler.prototype.notFound = function (_, callback) {
        callback(404, {
            'message': 'Looks like its a 404'
        });
    };
    Handler.prototype.users = function (data, callback) {
        var acceptableMethods = ['get', 'post', 'put', 'delete'];
        if (acceptableMethods.indexOf(data.method) == -1) {
            callback(500, {
                'message': 'Unacceptable Method sent'
            });
        }
        else {
            userControlller_1.default[data.method](data, callback);
        }
    };
    Handler.prototype.tokens = function (data, callback) {
        var acceptableMethods = ['get', 'post', 'put', 'delete'];
        if (acceptableMethods.indexOf(data.method) == -1) {
            callback(500, {
                'message': 'Unacceptable Method sent'
            });
        }
        else {
            tokenController_1.default[data.method](data, callback); // Callback here stands for a funciton call, so don't confuse.
        }
    };
    Handler.prototype.checks = function (data, callback) {
        var acceptableMethods = ['get', 'post', 'put', 'delete'];
        if (acceptableMethods.indexOf(data.method) == -1) {
            callback(500, {
                'message': 'Unacceptable Method sent'
            });
        }
        else {
            checkController_1.default[data.method](data, callback); // Callback here stands for a funciton call, so don't confuse.
        }
    };
    return Handler;
}());
exports.default = new Handler();
//# sourceMappingURL=handlers.js.map
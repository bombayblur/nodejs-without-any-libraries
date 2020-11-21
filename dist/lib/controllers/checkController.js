"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var checkModel_1 = require("../models/checkModel");
var ChecksController = /** @class */ (function () {
    function ChecksController() {
    }
    ChecksController.prototype.post = function (data, callback) {
        var dataObject = data.payload;
        var headerObject = data.header;
        var checksRequest = new checkModel_1.ChecksRequest(dataObject.statusCodes, dataObject.protocol, dataObject.method, dataObject.url, dataObject.timeout);
        if (checksRequest.validateCompleteChecksRequest()) {
            // Find the user that is trying to create this check from the token;
            // Check if the user has exceeded limit of max tokens.
            // Create a user object and hold it in memory
            // Create a checks object and store it in the checks database
            // Add the latest check to the user object
            // update the user object.
        }
        else {
            callback(400, { error: "Invalid paramaetes supplied for checks request" });
        }
    };
    ChecksController.prototype.get = function (data, callback) {
    };
    ChecksController.prototype.put = function (data, callback) {
    };
    ChecksController.prototype.delete = function (data, callback) {
    };
    return ChecksController;
}());
exports.default = new ChecksController();
//# sourceMappingURL=checkController.js.map
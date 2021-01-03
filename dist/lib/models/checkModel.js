"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChecksRequest = void 0;
var validation_1 = require("../validation");
var helpers_1 = __importDefault(require("../helpers"));
var ChecksRequest = /** @class */ (function () {
    function ChecksRequest(statusCodes, protocol, method, url, timeout) {
        statusCodes ? this.statusCodes = statusCodes : null;
        protocol ? this.protocol = protocol : null;
        method ? this.method = method : null;
        url ? this.url = url : null;
        timeout ? this.timeout = timeout : null;
        if (statusCodes && protocol && method && url && timeout) {
            this.id = helpers_1.default.genRandString(20);
        }
    }
    ;
    ChecksRequest.prototype.validateCompleteChecksRequest = function () {
        return validation_1.Validate(this, false);
    };
    ChecksRequest.prototype.validatePartialChecksRequests = function () {
        return validation_1.Validate(this, true);
    };
    __decorate([
        validation_1.ArrayMinLength(1),
        validation_1.CheckType('object'),
        validation_1.CheckInstance(Array)
    ], ChecksRequest.prototype, "statusCodes", void 0);
    __decorate([
        validation_1.OneOf(['https', 'http']),
        validation_1.CheckType('string')
    ], ChecksRequest.prototype, "protocol", void 0);
    __decorate([
        validation_1.OneOf(['get', 'post', 'put', 'post']),
        validation_1.CheckType('string')
    ], ChecksRequest.prototype, "method", void 0);
    __decorate([
        validation_1.CheckType('string')
    ], ChecksRequest.prototype, "url", void 0);
    __decorate([
        validation_1.CheckType('number'),
        validation_1.NumMinMax(1, 5)
    ], ChecksRequest.prototype, "timeout", void 0);
    return ChecksRequest;
}());
exports.ChecksRequest = ChecksRequest;
//# sourceMappingURL=checkModel.js.map
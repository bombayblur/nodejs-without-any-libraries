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
exports.TokenRequest = void 0;
var validation_1 = require("../validation");
var helpers_1 = __importDefault(require("../helpers"));
var TokenRequest = /** @class */ (function () {
    function TokenRequest(phoneNumber, password) {
        this.hashedPassword = helpers_1.default.hashPassword(password);
        this.phoneNumber = phoneNumber;
        this.password = password;
        this.id = helpers_1.default.genRandString(20);
        this.expiry = Date.now() + 3600000;
    }
    TokenRequest.prototype.validateRequest = function () {
        return validation_1.Validate(this, false);
    };
    TokenRequest.prototype.generateToken = function () {
        var token = this;
        delete token.hashedPassword;
        delete token.password;
        return token;
    };
    __decorate([
        validation_1.CheckType('string'),
        validation_1.MinLength(8)
    ], TokenRequest.prototype, "password", void 0);
    __decorate([
        validation_1.CheckType('number'),
        validation_1.ExactLength(10)
    ], TokenRequest.prototype, "phoneNumber", void 0);
    return TokenRequest;
}());
exports.TokenRequest = TokenRequest;
//# sourceMappingURL=tokenModel.js.map
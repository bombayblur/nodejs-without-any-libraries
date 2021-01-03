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
exports.User = void 0;
var validation_1 = require("../validation");
var helpers_1 = __importDefault(require("../helpers"));
var User = /** @class */ (function () {
    function User(firstName, lastName, phoneNumber, password, email, tos) {
        email ? this.email = email : null;
        firstName ? this.firstName = firstName : null;
        lastName ? this.lastName = lastName : null;
        phoneNumber ? this.phoneNumber = phoneNumber : null;
        password ? this.password = password : null;
        tos ? this.tos = tos : null;
        if (email && firstName && lastName && password && tos && phoneNumber) {
            this.checks = [];
        }
    }
    // Maybe we need setters and getters too.
    User.prototype.hashPassword = function () {
        this.password = helpers_1.default.hashPassword(this.password);
    };
    User.prototype.validateCompleteUser = function () {
        return validation_1.Validate(this, false);
    };
    User.prototype.validatePartialUser = function () {
        return validation_1.Validate(this, true);
    };
    __decorate([
        validation_1.MinLength(0),
        validation_1.CheckType('string')
    ], User.prototype, "firstName", void 0);
    __decorate([
        validation_1.MinLength(0),
        validation_1.CheckType('string')
    ], User.prototype, "lastName", void 0);
    __decorate([
        validation_1.ExactLength(10),
        validation_1.CheckType('number')
    ], User.prototype, "phoneNumber", void 0);
    __decorate([
        validation_1.MinLength(8),
        validation_1.CheckType('string')
    ], User.prototype, "password", void 0);
    __decorate([
        validation_1.MinLength(4),
        validation_1.CheckType('string')
    ], User.prototype, "email", void 0);
    __decorate([
        validation_1.IsBool(true),
        validation_1.CheckType('boolean')
    ], User.prototype, "tos", void 0);
    return User;
}());
exports.User = User;
//# sourceMappingURL=userModel.js.map
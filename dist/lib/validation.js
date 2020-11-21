"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NumMinMax = exports.ArrayMinLength = exports.OneOf = exports.CheckInstance = exports.CheckType = exports.IsBool = exports.ExactLength = exports.MinLength = exports.Validate = void 0;
var validatorObject = {};
function flagInjector(className, propertyName, flag) {
    var _a;
    var existingFlags;
    if (validatorObject[className]) {
        existingFlags = validatorObject[className][propertyName];
    }
    validatorObject[className] = __assign(__assign({}, validatorObject[className]), (_a = {}, _a[propertyName] = existingFlags ? __spreadArrays(existingFlags, [flag]) : [flag], _a));
}
function Validate(obj, partial) {
    var className = obj.constructor.name;
    if (!validatorObject[className]) {
        return true;
    }
    var returnValue = true;
    if (partial) {
        for (var property in validatorObject[className]) {
            if (obj[property]) {
                for (var _i = 0, _a = validatorObject[className][property]; _i < _a.length; _i++) {
                    var flag = _a[_i];
                    if (flag.bool) {
                        returnValue = returnValue && obj[property] == flag.bool;
                    }
                    else if (flag.minLength) {
                        returnValue = returnValue && obj[property].toString().trim().length > flag.minLength;
                    }
                    else if (flag.type) {
                        returnValue = returnValue && typeof (obj[property]) == flag.type;
                    }
                    else if (flag.exactLength) {
                        returnValue = returnValue && obj[property].toString().trim().lenght == flag.exactLength;
                    }
                    else if (flag.instance) {
                        returnValue = returnValue && obj[property] instanceof flag.instance;
                    }
                    else if (flag.oneOf) {
                        returnValue = returnValue && flag.oneOf.indexOf(obj[property]) > -1;
                    }
                    else if (flag.arrayMinLength) {
                        returnValue = returnValue && obj[property].length >= flag.arrayMinLength;
                    }
                    else if (flag.min && flag.max) {
                        returnValue = returnValue && obj[property] >= flag.min && obj[property] <= flag.max;
                    }
                }
            }
        }
    }
    else {
        for (var property in validatorObject[className]) {
            for (var _b = 0, _c = validatorObject[className][property]; _b < _c.length; _b++) {
                var flag = _c[_b];
                if (flag.bool) {
                    returnValue = returnValue && obj[property] == flag.bool;
                }
                else if (flag.minLength) {
                    returnValue = returnValue && obj[property].toString().trim().length >= flag.minLength;
                }
                else if (flag.type) {
                    returnValue = returnValue && typeof (obj[property]) == flag.type;
                }
                else if (flag.exactLength) {
                    returnValue = returnValue && obj[property].toString().trim().length == flag.exactLength;
                }
                else if (flag.instance) {
                    returnValue = returnValue && obj[property] instanceof flag.instance;
                }
                else if (flag.oneOf) {
                    returnValue = returnValue && flag.oneOf.indexOf(obj[property]) > -1;
                }
                else if (flag.arrayMinLength) {
                    returnValue = returnValue && obj[property].length >= flag.arrayMinLength;
                }
                else if (flag.min && flag.max) {
                    returnValue = returnValue && obj[property] >= flag.min && obj[property] <= flag.max;
                }
            }
        }
    }
    return returnValue;
}
exports.Validate = Validate;
function MinLength(length) {
    return function (target, key) {
        flagInjector(target.constructor.name, key, { minLength: length });
    };
}
exports.MinLength = MinLength;
function ExactLength(length) {
    return function (target, key) {
        flagInjector(target.constructor.name, key, { exactLength: length });
    };
}
exports.ExactLength = ExactLength;
function IsBool(bool) {
    return function (target, key) {
        flagInjector(target.constructor.name, key, { bool: bool });
    };
}
exports.IsBool = IsBool;
function CheckType(type) {
    return function (target, key) {
        flagInjector(target.constructor.name, key, { type: type });
    };
}
exports.CheckType = CheckType;
function CheckInstance(instance) {
    return function (target, key) {
        flagInjector(target.constructor.name, key, { instance: instance });
    };
}
exports.CheckInstance = CheckInstance;
function OneOf(list) {
    return function (target, key) {
        flagInjector(target.constructor.name, key, { oneOf: list });
    };
}
exports.OneOf = OneOf;
function ArrayMinLength(length) {
    return function (target, key) {
        flagInjector(target.constructor.name, key, { arrayMinLength: length });
    };
}
exports.ArrayMinLength = ArrayMinLength;
function NumMinMax(num1, num2) {
    return function (target, key) {
        flagInjector(target.constructor.name, key, { min: num1, max: num2 });
    };
}
exports.NumMinMax = NumMinMax;
//# sourceMappingURL=validation.js.map
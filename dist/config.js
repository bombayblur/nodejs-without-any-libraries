"use strict";
// Create and export configuration variables
Object.defineProperty(exports, "__esModule", { value: true });
//container for all environemnts
var environments = {};
environments.staging = {
    'httpPort': 3000,
    'httpsPort': 3001,
    'envName': 'staging',
    'secretPhrase': 'i love cats',
    'maxChecks': 5,
    'sms': {
        'accountSid': 'ACb32d411ad7fe886aac54c665d25e5c5d',
        'authToken': '9455e3eb3109edc12e3d8c92768f7a67',
        'fromPhone': '+15005550006'
    },
    'email': {
        'ourAddress': 'indianindiescene@gmail.com',
        'ourPass': 'poopiechoo'
    }
};
environments.production = {
    'httpPort': 5000,
    'httpsPort': 5001,
    'envName': 'production',
    'secretPhrase': 'i love cats',
    'maxChecks': 5,
    'sms': {},
    'email': {}
};
//Determine which enviroment was passed as a comman-line argument
var currentEnvironment = typeof (process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';
var configToExport = typeof (environments[currentEnvironment]) == 'undefined' ? environments.staging : environments[currentEnvironment];
exports.default = configToExport;
//# sourceMappingURL=config.js.map
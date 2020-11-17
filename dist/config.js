"use strict";
// Create and export configuration variables
Object.defineProperty(exports, "__esModule", { value: true });
//container for all environemnts
var environments = {};
environments.staging = {
    'httpPort': 3000,
    'httpsPort': 3001,
    'envName': 'staging',
    'secretPhrase': 'i love cats'
};
environments.production = {
    'httpPort': 5000,
    'httpsPort': 5001,
    'envName': 'production',
    'secretPhrase': 'i love cats'
};
//Determine which enviroment was passed as a comman-line argument
var currentEnvironment = typeof (process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';
var configToExport = typeof (environments[currentEnvironment]) == 'undefined' ? environments.staging : environments[currentEnvironment];
exports.default = configToExport;

// Create and export configuration variables

interface Config {
    httpPort:number,
    httpsPort:number,
    envName:string,
    secretPhrase:string,
    maxChecks:number,
    sms:{[key:string]:any},
    email:{[key:string]:any},

}

interface Environment {
    [envName:string]:Config
}

//container for all environemnts
let environments:Environment = {};

environments.staging = {
'httpPort': 3000,
'httpsPort': 3001,
'envName':'staging',
'secretPhrase':'i love cats',
'maxChecks':5,
'sms':{
    'accountSid' : 'ACb32d411ad7fe886aac54c665d25e5c5d',
    'authToken' : '9455e3eb3109edc12e3d8c92768f7a67',
    'fromPhone' : '+15005550006'
},
'email':{
    'ourAddress':'indianindiescene@gmail.com',
    'ourPass':'poopiechoo'
}
}

environments.production = {
'httpPort':5000,
'httpsPort':5001,
'envName':'production',
'secretPhrase':'i love cats',
'maxChecks':5,
'sms':{},
'email':{}
}


//Determine which enviroment was passed as a comman-line argument

let currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase(): '';

let configToExport = typeof(environments[currentEnvironment]) == 'undefined' ? environments.staging : environments[currentEnvironment];

export default configToExport ;


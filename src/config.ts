// Create and export configuration variables

interface Config {
    httpPort:number,
    httpsPort:number,
    envName:string,
    secretPhrase:string
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
'secretPhrase':'i love cats'
}

environments.production = {
'httpPort':5000,
'httpsPort':5001,
'envName':'production',
'secretPhrase':'i love cats'
}


//Determine which enviroment was passed as a comman-line argument

let currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase(): '';

let configToExport = typeof(environments[currentEnvironment]) == 'undefined' ? environments.staging : environments[currentEnvironment];

export default configToExport ;


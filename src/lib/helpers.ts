let crypto = require('crypto');
let config = require('../config.js');

type Helpers = {
    [helperName:string]:Function,
}

let helpers:Helpers = {};

helpers.parseToJson = function(string:string, callback:Function){
    try{
        return JSON.parse(string);
    } catch(err) {
        callback(err);
    }
}

helpers.hashPassword = function(string:String){
    return crypto.createHmac('sha256', config.secretPhrase).update(string).digest('hex');
}

helpers.genRandString = function(length:number){
    let possibleCharachters = 'abcdefghijklmnopqrstuvwxyz0123456789'
    let result = '';
    for(let i=0; i<length; i++){
        result += possibleCharachters.charAt(Math.floor(Math.random()*possibleCharachters.length))
    }
    return result;
}




export default helpers;


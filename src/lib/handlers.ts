let helpers = require('./helpers');
let dataLib = require('./data');

export type CallbackFunction = (data:object, callback:Function)=>void;

type SetofCallBacks = {
    [method:string]:CallbackFunction
}

interface Handler {
    [route:string]:CallbackFunction | SetofCallBacks,
}

let handler:Handler = {}

handler.ping = function (data, callback) {
    callback(200);
}

handler.notFound = function (data, callback) {
    callback(404, {
        'message': 'Looks like its a 404'
    })
}

handler.users = function (data, callback) {
    let acceptableMethods = ['get', 'post', 'put', 'delete'];

    if (acceptableMethods.indexOf(data.method) == -1) {
        callback(500, {
            'message': 'Unacceptable Method sent'
        });
    } else {
        handler._users[data.method](data,callback);
    }
}

handler._users = {}

handler._users.post = function (data, callback) {

    let dataObject = data.payload;
    let user = {}

    user.firstName = typeof (dataObject.firstName) == 'string' && dataObject.firstName.trim().length > 0 && dataObject.firstName;
    user.lastName = typeof (dataObject.lastName) == 'string' && dataObject.lastName.trim().length > 0 && dataObject.lastName;
    user.phoneNumber = typeof (dataObject.phoneNumber) == 'number' && dataObject.phoneNumber.toString().trim().length == 10 && dataObject.phoneNumber;
    user.password = typeof (dataObject.password) == 'string' && dataObject.password.trim().length > 8 && helpers.hashPassword(dataObject.password);
    user.email = typeof (dataObject.email) == 'string' && dataObject.email.trim().length > 6 && dataObject.email;
    user.tos = typeof (dataObject.tos) == 'boolean' && dataObject.tos == true && dataObject.tos;

    

    if (user.firstName && user.lastName && user.email && user.phoneNumber && user.password && user.tos) {

        dataLib.readFile('users', user.phoneNumber.toString(), (err, data) => {
            if (err) {
                dataLib.createFile('users', user.phoneNumber, user, (err) => {
                    if (!err) {
                        delete user.password;
                        callback(200, user)
                    } else if (err) {
                        callback(500, {error:"Unable to create user. Here is the full message: " + err.message})
                    }
                });
            } else {
                callback(400, {error:'User may already Exist'})
            }
        });

    } else {
        callback(400, {error:'Incomplete Data'});
    }

}

handler._users.get = function (data, callback) {
    
    let queryString = data.queryString;

    if (queryString.phonenumber && queryString.phonenumber.length == 10) {

        dataLib.readFile('users', queryString.phonenumber, (err, storeData) => {

            if (err) {

                callback(400, {error:'User Probably not found.'+err.message });

            } else {

                let dataToShip = helpers.parseToJson(storeData, (err) => callback(500,{error:err.message}) );
                delete dataToShip.password;

                // Verify the incoming request and only then serve.
                let headerToken = data.header.token;
                handler._tokens.verifyToken(headerToken, dataToShip.phoneNumber.toString(), (err) => {
                    if (!err) {
                        callback(200, dataToShip);
                    } else {
                        callback(400, {error: err.message})
                    }
                });
            }
        })
    } else {
        callback(400, {error:'Invalid phone number'});
    }
}

handler._users.put = function (data, callback) {
    let phoneNumber = data.queryString.phonenumber && data.queryString.phonenumber.length == 10 && data.queryString.phonenumber;

    if (phoneNumber) {
        let updateObject = {}
        if(data.payload.firstName){
            updateObject.firstName = typeof (data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 && data.payload.firstName;
        }
        
        if(data.payload.lastName){
            updateObject.lastName = typeof (data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 && data.payload.lastName;
        }

        if(data.payload.phoneNumber){
            updateObject.phoneNumber = typeof (data.payload.phoneNumber) == 'number' && data.payload.phoneNumber.toString().trim().length == 10 && data.payload.phoneNumber;
        }
        
        if(data.payload.email){
            updateObject.email = typeof (data.payload.email) == 'string' && data.payload.email.trim().length > 6 && data.payload.email;
        }

        if(data.payload.password){
            updateObject.password = typeof (data.payload.password) == 'string' && data.payload.password.trim().length > 8 && helpers.hashPassword(data.payload.password);
        }
                                        
        dataLib.readFile('users',phoneNumber, (err,readData)=>{
            if(err){

                callback(400,{error:'User probably doesn\'t exit. '+err.message});
            } else {
                let userObject = helpers.parseToJson(readData, (err) => callback( 500, {error:err.message} ));
                Object.assign(userObject,updateObject);

                 // Verify the incoming request and only then serve.
                 let headerToken = data.header.token;
                 handler._tokens.verifyToken(headerToken, userObject.phoneNumber, (err) => {
                     if (!err) {
                        dataLib.updateFile('users',phoneNumber, userObject, (err)=>{
                            if(err){
                                callback(500,{error:'Couldn\'t update user'+err.message})
                            }else{
                                callback( 200, {message:userObject.phoneNumber+' has been updated'});
                            }  
                        });
                     } else {
                         callback(400, {error: err.message})
                     }
                 });


                
            }
        })

    } else {
        callback(400,{error:'Invalid Phone Number'})
    }
}

handler._users.delete = function (data, callback) {
    let phoneNumber = data.queryString.phonenumber && data.queryString.phonenumber.length == 10 && data.queryString.phonenumber;
    let headerToken = data.header.token;
    
    dataLib.readFile('users', phoneNumber,(err,readData)=>{
        if(err){
            callback(400,{error:'User doesn\'t exist'});
        } else {
            let userObject = helpers.parseToJson(readData, (err) => callback( 500, {error:err.message} ));
            
            
            handler._tokens.verifyToken(headerToken, userObject.phoneNumber, (err) => {
                if (!err) {
                    dataLib.deleteFile('users', phoneNumber, (err)=>{
                        if(err){
                            callback(500,{error:'User wasn\'t deleted'})
                        }
                        callback(200, {message:phoneNumber+' was deleted'})
                    })
                } else {
                    callback(400, {error: err.message + headerToken + userObject.phoneNumber})
                }
            });

            
        }
    })

}




handler.tokens = function(data, callback) {
    let acceptableMethods = ['get', 'post', 'put', 'delete'];

    if (acceptableMethods.indexOf(data.method) == -1) {
        callback(500, {
            'message': 'Unacceptable Method sent'
        });
    } else {
        handler._tokens[data.method](data,callback); // Callback here stands for a funciton call, so don't confuse.
    } 
}

handler._tokens = {}

// Take phone and password, verify, then generate a token
handler._tokens.post = function(data,callback){

    let payload = data.payload;
    let phoneNumber = typeof (payload.phoneNumber) == 'number' && payload.phoneNumber.toString().trim().length == 10 && payload.phoneNumber.toString();
    let password = typeof (payload.password) == 'string' && payload.password.trim().length > 8 && helpers.hashPassword(payload.password);
    
    if(phoneNumber && password){

        let credObject = {};
        credObject.password = password;
        credObject.phoneNumber = phoneNumber;

        dataLib.readFile('users', phoneNumber, (err, data)=>{
            if(err){
                callback(400, {error: 'User not found'});
            } else {
                
                let userData = helpers.parseToJson(data, (err)=>callback(500,{error:'Parsing Failure'}));

                //check if the credentials supplied match
                if(userData.password == credObject.password){

                    //create a token object
                    let token = {}
                    token.id = helpers.genRandString(20);
                    token.phoneNumber = phoneNumber;
                    token.expiry = Date.now() + (1000 * 60 * 60)

                    dataLib.createFile('tokens', token.id, token, (err)=>{
                        if(!err){
                            callback(200, token);
                        } else {
                            callback(500, {error: 'Failled to create a token.'})
                        }
                    });
                }
            }
        });
    } else {
        callback(400, {error:'Could not validate credentials.'})
    }
}

// Take id of token from query string and send back the token
handler._tokens.get = function(data,callback){
    let id = typeof(data.queryString.id) == 'string' && data.queryString.id.trim().length == 20 ? data.queryString.id.trim() : false;

    if(id){
        dataLib.readFile('tokens', id, (err, data)=>{
            if(err){
                callback(404, {error:'Token not found.'})
            } else {
                let storedToken = helpers.parseToJson(data, (err)=>callback(500, {error:'Parsing Failure'}));

                if(storedToken.expiry <= Date.now()){
                    callback(400, {error:'Token has expired, please request new token'});
                } else {
                    callback(200, storedToken);
                }
            }
        })
    }
    else{
        callback(400, {error:'Incomplete Query'});
    }

    
}

// Take id of token, check if it has expired and then issue a new token 
handler._tokens.put = function(data,callback){
    let id = typeof(data.queryString.id) == 'string' && data.queryString.id.trim().length == 20 ? data.queryString.id.trim() : false;
    let extend = data.queryString.extend;

    if(id && extend){
        dataLib.readFile('tokens', id, (err, data)=>{
            if(err){
                callback(404, {error:'Token not found.'})
            } else {
                let token = helpers.parseToJson(data, (err)=>callback(500, {error:'Parsing Failure'}));

                if(token.expiry <= Date.now()){
                    callback(400, {error:'Token has expired, please request new token'});
                } else {
                   token.expiry = Date.now() +(3600000);
                   dataLib.updateFile('tokens', id, token, (err)=>{
                       if(err){
                           callback(500, {error:'Failled to create new Token'});
                       } else {
                           callback(200, token);
                       }
                   }) 
                }
            }
        })
    }
    else{
        callback(400, {error:'Incomplete Query'});
    }
}

// Take id of token and dele
handler._tokens.delete = function(data,callback){
    let id = typeof(data.queryString.id) == 'string' && data.queryString.id.trim().length == 20 ? data.queryString.id.trim() : false;

    if(id){
        dataLib.readFile('tokens', id, (err, data)=>{
            if(err){
                callback(404, {error:'Token not found.'})
            } else {
              dataLib.deleteFile('tokens', id, (err)=>{
                  if(err){
                      callback(500, {error:'Token could not be deleted'})
                  } else {
                      callback(200, {message: 'Token succesfully deleted'})
                  }
              }) 
            }
        })
    }
    else{
        callback(400, {error:'Incomplete Query'});
    }
}

// Whenever someone wants to get, put or delete one has to supply the token in the header.
// The token will be validated against the entry we are performing the operation on.
// If this function returns true we proceed else we dont.

handler._tokens.verifyToken = function(id, phone, callback) { //The callback only takes an error thats all.

    if(typeof(id) == 'string' && id.trim().length == 20){

        dataLib.readFile('tokens', id, (err, data)=>{
            
            if(err){
              callback(Error('Token not found.'))
            } else {
                let userObject = helpers.parseToJson(data, (err)=>callback(Error("Parse Error")));
                if(userObject.phoneNumber == phone){
                    callback(null);
                } else {
                    callback(Error("Access Denied"));
                }
            }  
        });

    }
    else{

        callback(Error('Improper headers set/no token supplied'));
    }
    
}


handler.checks =function(data, callback) {
    let acceptableMethods = ['get', 'post', 'put', 'delete'];

    if (acceptableMethods.indexOf(data.method) == -1) {
        callback(500, {
            'message': 'Unacceptable Method sent'
        });
    } else {
        handler._checks[data.method](data,callback); // Callback here stands for a funciton call, so don't confuse.
    } 
} 

handler._checks = {};

handler._checks.post = (data, callback) => {

    let statusCodes = typeof(data.payload.statusCodes) == 'object' && data.payload.statusCodes instanceof Array && data.payload.statusCodes.length > 0 && data.payload.statusCodes.every((val)=>val.toString().length == 3) && data.payload.stausCodes;
    let protocol = typeof(data.payload.statusCodes) == 'string' && ['https', 'http'].indexOf(data.payload.protcol) > -1 && data.payload.protocol;
    let method = typeof(data.payload.method) == 'string' && ['get', 'post', 'put', 'delete'].indexOf(data.payload.method) > -1 && data.payload.method;
    let url = typeof(data.paload.url) == 'string' && data.payload.url.trinm().length > 0 && data.payload.url;
    let timeout = typeof(data.payload.timeout) == 'number' && data.payload.timeout > 1 && data.payload.timeout < 5 && data.payload.timeout % 1 == 0 && data.payload.timeout; 

    // Form a checks object, complete with ID
    // Using the Id from the header, pull out the phone number of the concerned user
    // If that is succesfull and we have a read on the user, then extract the user object and check how many checks the person has if/any, but not exceeding 5.
    // Once that is established then append the ID to the user.checks list
    // File Update user and Create the checks object in the checks directory.

    if(statusCodes && protocol && method && url && timeout) {

        let checkObject = {
            'statusCodes':statusCodes,
            'protocol':protocol,
            
        }

    } else {
        callback(400, {error:'Incomplete Data'});
    }


}

export default handler;
import { Controller, RequestData, ResponseHandler  } from "../models/models";
import {TokenRequest} from '../models/tokenModel';
import dataLib from '../data';

class TokensController implements Controller{

   post(data:RequestData,callback:ResponseHandler){
       
        let payload = <TokenRequest>data.payload;
        let tokenRequest = new TokenRequest(payload.phoneNumber, <string>payload.password)
        
        if(tokenRequest.validateRequest()){
    
            dataLib.readFile('tokens', tokenRequest.phoneNumber.toString(), (err:Error | null, tokenData:TokenRequest)=>{
                if(err){
                    callback(400, {error: 'User not found'});
                } else {
                    //check if the credentials supplied match
                    if(tokenData.password == tokenRequest.hashedPassword){
    
                        //create a token object
                        let token:TokenRequest= tokenRequest.generateToken();
                        
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
   get(data:RequestData,callback:ResponseHandler){
        let id = typeof(data.queryString.id) == 'string' && data.queryString.id.trim().length == 20 ? data.queryString.id.trim() : false;
    
        if(id){
            dataLib.readFile('tokens', id, (err, storedToken:TokenRequest)=>{
                if(err){
                    callback(404, {error:'Token not found.'})
                } else {
    
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
    put(data:RequestData,callback:ResponseHandler){
        let id = typeof(data.queryString.id) == 'string' && data.queryString.id.trim().length == 20 ? data.queryString.id.trim() : false;
        let extend:boolean | undefined = data.queryString.extend;
    
        if(id && extend){
            dataLib.readFile('tokens', id, (err, token:TokenRequest)=>{
                if(err){
                    callback(404, {error:'Token not found.'})
                } else {
                    if(token.expiry <= Date.now()){
                        callback(400, {error:'Token has expired, please request new token'});
                    } else {
                       token.expiry = Date.now() +(3600000);

                        dataLib.updateFile('tokens', <string>id , token, (err)=>{
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
    delete(data:RequestData,callback:ResponseHandler){
        let id = typeof(data.queryString.id) == 'string' && data.queryString.id.trim().length == 20 ? data.queryString.id.trim() : false;
    
        if(id){
            dataLib.readFile('tokens', id, (err, data)=>{
                if(err){
                    callback(404, {error:'Token not found.'})
                } else {
                  dataLib.deleteFile('tokens', <string>id, (err)=>{
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
    
    verifyToken(id:string, phone:number, callback:(err:Error | null)=>void) { //The callback only takes an error thats all.
    
        if(typeof(id) == 'string' && id.trim().length == 20){
    
            dataLib.readFile('tokens', id, (err, tokenObject:TokenRequest)=>{
                
                if(err){
                  callback(Error('Token not found.'))
                } else {
                    if(tokenObject.phoneNumber == phone){
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
    
}

export default new TokensController;
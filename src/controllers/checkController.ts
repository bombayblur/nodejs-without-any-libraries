import { Controller, HeaderObject, RequestData, ResponseHandler } from "../models/models";
import { ChecksRequest } from '../models/checkModel';
import dataLib from '../lib/data';
import { TokenRequest } from "../models/tokenModel";
import { User } from "../models/userModel";
import tokenController from "./tokenController";

class ChecksController implements Controller {

    post(data: RequestData, callback: ResponseHandler) {

        let dataObject = data.payload as ChecksRequest;
        let headerObject = data.header as HeaderObject;
        let checksRequest = new ChecksRequest(dataObject.statusCodes, dataObject.protocol, dataObject.method!.toLowerCase(), dataObject.url, dataObject.timeout);

        if (checksRequest.validateCompleteChecksRequest() && headerObject.token) {

            // Find the user that is trying to create this check from the token;
            dataLib.readFile('tokens', headerObject.token, (err:Error | null, tokenData:TokenRequest)=>{
                if(err){
                    callback(400, {error:"Invalid Token Supplied"});
                } else {
                    if(tokenData.expiry < Date.now()){
                        callback(400,{error:"Expired Token, Please request new Token"});
                    } else {
                        dataLib.readFile('users', tokenData.phoneNumber.toString(), (err: Error | null, userData:User)=>{
                            if(err){
                                callback(500,{error:"Could not find or load the user"});
                            } else {
                                if(userData.checks!.length >= 5){
                                    callback(400,{error:"User has exceeded checks limit"});
                                } else {
                                    userData.checks!.push(checksRequest.id!);
                                    checksRequest.phoneNumber = userData.phoneNumber;

                                    dataLib.createFile('checks', checksRequest.id!, checksRequest,(err:Error | null)=>{
                                        if(err){
                                            callback(500,{error:"Failure to create ChecksObject"});
                                        } else {
                                            dataLib.updateFile('users', userData.phoneNumber!.toString(), userData, (err:Error | null)=>{
                                                if(err){
                                                   callback(500, {error:"Failure to update user"}); 
                                                } else {
                                                    callback(200, {message:checksRequest});
                                                }
                                            })
                                        }
                                    })
                                }
                            }
                        })
                    }
                }
            })
        } else {
            callback(400, { error: "Invalid paramaetes supplied for checks request" });
        }
    }

    get(data: RequestData, callback: ResponseHandler) {
        let token = data.header.token as string;
        let checkId = data.queryString.check as string;

        if(token!.length == 20 && checkId.length == 20){
            dataLib.readFile('checks', checkId, (err:Error | null, checksData:ChecksRequest)=>{
                if(err){
                    callback(400, {error:"No such check exists or unable to read database."})
                } else {
                    tokenController.verifyToken(token, checksData.phoneNumber!, (err:Error | null)=>{
                        if(err){
                            callback(400,{error:"Invalid token supplied"});
                        } else {
                            callback(200,{message:checksData});
                        }
                    })
                }
            })
        } else {
            callback(400, {error:"Improper Headers or Query Parameters"});
        }
        
    }

    put(data: RequestData, callback: ResponseHandler) {
        let token = data.header.token as string;
        let checkId = data.queryString.check as string;
        let body = data.payload as ChecksRequest;

        let newCheckUpdateData = new ChecksRequest(body.statusCodes, body.protocol, body.method, body.url, body.timeout);

        if(token!.length == 20 && checkId.length == 20 && newCheckUpdateData.validatePartialChecksRequests()){
            dataLib.readFile('checks', checkId, (err:Error | null, oldChecksData:ChecksRequest)=>{
                if(err){
                    callback(400, {error:"No such check exists or unable to read database."})
                } else {
                    tokenController.verifyToken(token, oldChecksData.phoneNumber!, (err:Error | null)=>{
                        if(err){
                            callback(400,{error:"Invalid token supplied"});
                        } else {
                            Object.assign(oldChecksData, newCheckUpdateData);

                            dataLib.updateFile('checks', checkId, oldChecksData, (err:Error | null)=>{
                                if(err){
                                    callback(500, {error:"Failled to update Checks Data"})
                                } else {
                                    callback(200, { message:oldChecksData});
                                }
                            });
                        }
                    })
                }
            }) 
        }




    }

    delete(data: RequestData, callback: ResponseHandler) {
        let token = data.header.token as string;
        let checkId = data.queryString.check as string;

        if(token!.length == 20 && checkId.length == 20){
            dataLib.readFile('checks', checkId, (err:Error | null, checksData:ChecksRequest)=>{
                if(err){
                    callback(400, {error:"No such check exists or unable to read database."})
                } else {
                    tokenController.verifyToken(token, checksData.phoneNumber!, (err:Error | null)=>{
                        if(err){
                            callback(400,{error:"Invalid token supplied"});
                        } else {
                            dataLib.readFile('users', checksData.phoneNumber!.toString(), (err:Error | null, userData:User)=>{
                                if(err){
                                    callback(500, {error:"Could not access user to delete check"});
                                } else {
                                    userData.checks = userData.checks!.filter((element)=> element !== checksData.id);

                                    dataLib.updateFile('users', checksData.phoneNumber!.toString(), userData, (err:Error | null) =>{
                                        if(err){
                                            callback(500, {error:"Could not update user data while deleting a check"})
                                        } else {
                                            dataLib.deleteFile('checks', checkId, (err:Error | null)=>{
                                                if(err){
                                                    callback(500, {error:"Could not delete the check"})
                                                } else {
                                                    callback(200, {message:checkId + " was succesfully deleted"})
                                                }
                                            })
                                        }
                                    })
                                }
                            })

                            
                        }
                    })
                }
            })
        } else {
            callback(400, {error:"Improper Headers or Query Parameters"});
        }

    }

}

export default new ChecksController();
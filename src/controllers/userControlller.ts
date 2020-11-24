import { Controller, QueryStringObject, RequestData, ResponseHandler } from '../models/models';
import dataLib from '../lib/data';
import tokenController from './tokenController';
import { User } from '../models/userModel';




class UsersController implements Controller {

    post(data: RequestData, callback: ResponseHandler) {

        let dataObject: User = <User>data.payload;

        let user = new User(dataObject.firstName, dataObject.lastName, dataObject.phoneNumber, dataObject.password, dataObject.email, dataObject.tos);

        if (user.validateCompleteUser()) {
            user.hashPassword();
            dataLib.readFile('users', user.phoneNumber!.toString(), (err:Error | null, _: User) => {
                if (err) {
                    dataLib.createFile('users', user.phoneNumber!.toString(), user, (err:Error | null) => {
                        if (!err) {
                            delete user.password;
                            callback(200, {message:user})
                        } else if (err) {
                            callback(500, { error: "Unable to create user. Here is the full message: " + err.message })
                        }
                    });
                } else {
                    callback(400, { error: 'User may already Exist' })
                }
            });
        } else {
            callback(400, { error: 'Incomplete Data' });
        }

    }

    get(data: RequestData, callback: ResponseHandler) {

        let queryString: QueryStringObject = data.queryString;

        if (queryString.phonenumber && queryString.phonenumber.length == 10) {

            dataLib.readFile('users', queryString.phonenumber, (err:Error | null, dataToShip: User) => {

                if (err) {
                    callback(400, { error: 'User Probably not found.' + err.message });
                } else {
                    delete dataToShip.password;

                    // Verify the incoming request and only then serve.
                    let headerToken = data.header.token!;
                    tokenController.verifyToken(headerToken, dataToShip.phoneNumber!, (err: Error | null) => {
                        if (!err) {
                            callback(200, {message:dataToShip});
                        } else {
                            callback(400, { error: err.message })
                        }
                    });
                }
            })
        } else {
            callback(400, { error: 'Invalid phone number' });
        }
    }

    put(data: RequestData, callback: ResponseHandler) {
        let phoneNumber: string = data.queryString.phonenumber!;

        if (typeof (phoneNumber) == 'string' && phoneNumber!.length == 10) {

            let dataObject: User = <User>data.payload;
            let updateObject = new User(dataObject.firstName, dataObject.lastName, dataObject.phoneNumber, dataObject.password, dataObject.email, dataObject.tos);

            if (updateObject.validatePartialUser()) {
                dataLib.readFile('users', phoneNumber, (err:Error | null, userObject: User) => {
                    if (err) {
                        callback(400, { error: 'User probably doesn\'t exit. ' + err.message });
                    } else {
                        let newObj = Object.assign(userObject, updateObject);
                        let headerToken = data.header.token!;
                        tokenController.verifyToken(headerToken, userObject.phoneNumber!, (err: Error | null) => {
                            if (!err) {
                                dataLib.updateFile('users', phoneNumber, userObject, (err:Error | null) => {
                                    if (err) {
                                        callback(500, { error: 'Couldn\'t update user' + err.message })
                                    } else {
                                        callback(200, { message: userObject.phoneNumber + ' has been updated' });
                                    }
                                });
                            } else {
                                callback(400, { error: err.message })
                            }
                        });
                    }
                })
            }
        } else {
            callback(400, { error: 'Invalid Phone Number' })
        }
    }
   
    // @TODO Delete all checks
    delete(data: RequestData, callback: ResponseHandler) {

        let headerToken: string = data.header.token!;
        let phoneNumber: string = data.queryString.phonenumber!;

        if (typeof (phoneNumber) == 'string' && phoneNumber!.length == 10 && headerToken && headerToken.length == 20) {
            dataLib.readFile('users', phoneNumber, (err:Error | null, userObject:User) => {
                if (err) {
                    callback(400, { error: 'User doesnt exist' });
                } else {
                    tokenController.verifyToken(headerToken, userObject.phoneNumber!, (err: Error | null) => {
                        if (!err) {
                            let checksToDelete = userObject.checks;
                            let checkDeleteErrors: {check:string; error:string}[] = [];

                            for(let check of checksToDelete!){
                                dataLib.deleteFile('checks', check, (err:Error | null)=>{
                                    if(err){
                                        checkDeleteErrors.push({check:check, error:err.message});
                                    }
                                })
                            }

                            if(checkDeleteErrors.length>0){
                                let message = JSON.stringify(checkDeleteErrors);
                                callback(500, {error:message})
                            } else {
                                dataLib.deleteFile('users', phoneNumber, (err:Error | null) => {
                                    if (err) {
                                        callback(500, { error: 'User wasn\'t deleted' })
                                    }
                                    callback(200, { message: phoneNumber + ' was deleted' })
                                })
                            }

                            
                        } else {
                            callback(400, { error: err.message })
                        }
                    });
                }
            });
        } else {
            callback(400, { error: 'Incomplete Credentials or info supplied' });
        }
    }


}

export default new UsersController;
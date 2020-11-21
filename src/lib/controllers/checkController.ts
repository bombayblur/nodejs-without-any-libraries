import { Controller, HeaderObject, RequestData, ResponseHandler } from "../models/models";
import {ChecksRequest} from '../models/checkModel';

class ChecksController implements Controller {
    post(data:RequestData, callback:ResponseHandler) {

        let dataObject = data.payload as ChecksRequest;
        let headerObject = data.header as HeaderObject;
        let checksRequest = new ChecksRequest(dataObject.statusCodes, dataObject.protocol, dataObject.method, dataObject.url, dataObject.timeout);
    
        if(checksRequest.validateCompleteChecksRequest()){

            // Find the user that is trying to create this check from the token;
            // Check if the user has exceeded limit of max tokens.
            // Create a user object and hold it in memory
            // Create a checks object and store it in the checks database
            // Add the latest check to the user object
            // update the user object.
            

        } else {
            callback(400, {error:"Invalid paramaetes supplied for checks request"});
        }
    }

    get(data:RequestData,callback:ResponseHandler){

    }

    put(data:RequestData,callback:ResponseHandler){

    }

    delete(data:RequestData,callback:ResponseHandler){

    }

}

export default new ChecksController();
import helpers from '../lib/helpers';
import dataLib from '../lib/data';
import {RequestData, ResponseHandler} from '../models/models';
import userController from '../controllers/userControlller';
import tokenController from '../controllers/tokenController';
import checkController from '../controllers/checkController';

class Handler {

    ping(_:RequestData , callback:ResponseHandler) {
        callback(200,{message:'ping'});
    }

    notFound(_:RequestData, callback:ResponseHandler) {
        callback(404, {
            'message': 'Looks like its a 404'
        })
    }

    users(data:RequestData, callback:ResponseHandler) {
        let acceptableMethods = ['get', 'post', 'put', 'delete'];
    
        if (acceptableMethods.indexOf(data.method) == -1) {
            callback(500, {
                'message': 'Unacceptable Method sent'
            });
        } else {
                userController[data.method](data, callback);
        }
    }

    tokens(data:RequestData, callback:ResponseHandler) {
        let acceptableMethods = ['get', 'post', 'put', 'delete'];
    
        if (acceptableMethods.indexOf(data.method) == -1) {
            callback(500, {
                'message': 'Unacceptable Method sent'
            });
        } else {
            tokenController[data.method](data,callback); // Callback here stands for a funciton call, so don't confuse.
        } 
    }

   checks(data:RequestData, callback:ResponseHandler) {
        let acceptableMethods = ['get', 'post', 'put', 'delete'];
    
        if (acceptableMethods.indexOf(data.method) == -1) {
            callback(500, {
                'message': 'Unacceptable Method sent'
            });
        } else {
            checkController[data.method](data,callback); // Callback here stands for a funciton call, so don't confuse.
        } 
    } 


}


export default new Handler();
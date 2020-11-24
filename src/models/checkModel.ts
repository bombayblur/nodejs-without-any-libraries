import {NumMinMax, CheckType, MinLength ,ExactLength, Validate, IsBool, ArrayMinLength, CheckInstance, OneOf} from '../validation/validation';
import helpers from '../lib/helpers'
import { throws } from 'assert';


export class ChecksRequest {
    @ArrayMinLength(1) 
    @CheckType('object') 
    @CheckInstance(Array)
    public statusCodes?:number[];

    @OneOf(['https','http'])
    @CheckType('string')
    public protocol?:string;

    @OneOf(['get','post','put','post'])
    @CheckType('string')
    public method?:string;

    @CheckType('string')
    public url?:string;

    @CheckType('number')
    @NumMinMax(1,5)
    public timeout?:number;

    public id?:string;
    public phoneNumber?:number;

    constructor(statusCodes?:number[], protocol?:string, method?:string, url?:string, timeout?:number,){
        statusCodes ? this.statusCodes = statusCodes: null;
        protocol ? this.protocol = protocol: null;
        method ? this.method = method: null;
        url ? this.url = url: null;
        timeout ? this.timeout = timeout : null;
        

        if(statusCodes && protocol && method && url && timeout){
            this.id = helpers.genRandString(20);
        }
    };

    validateCompleteChecksRequest(){
        return Validate(this, false);
    }

    validatePartialChecksRequests(){
        return Validate(this, true);
    }
}
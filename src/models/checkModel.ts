import {NumMinMax, CheckType, MinLength ,ExactLength, Validate, IsBool, ArrayMinLength, CheckInstance, OneOf} from '../validation/validation';
import helpers from '../lib/helpers';

type Status = "up" | "down" | "unchecked";

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

    @OneOf(['up', 'down', 'unchecked'])
    public status?:Status;
    public reason?:string;

    @CheckType('number')
    public lastChecked?:number;

    public id?:string;
    public phoneNumber?:number;

    constructor(statusCodes?:number[], protocol?:string, method?:string, url?:string, timeout?:number, phoneNumber?:number, id?:string, status?:Status, lastChecked?:number){
        statusCodes ? this.statusCodes = statusCodes: null;
        protocol ? this.protocol = protocol: null;
        method ? this.method = method: null;
        url ? this.url = url: null;
        timeout ? this.timeout = timeout : null;

        id ? this.id = id : null;
        status ? this.status = status : null;
        lastChecked ?this.lastChecked = lastChecked: null;
        phoneNumber ? this.phoneNumber = phoneNumber: null;

        
        if(statusCodes && protocol && method && url && timeout && !id && !status && !lastChecked){
            this.id = helpers.genRandString(20);
            this.status = 'unchecked';
            this.lastChecked = Date.now();
        }
    };

    validateCompleteChecksRequest(){
        return Validate(this, false);
    }

    validatePartialChecksRequests(){
        return Validate(this, true);
    }
}




// Cases where we use 
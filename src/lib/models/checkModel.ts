import {NumMinMax, CheckType, MinLength ,ExactLength, Validate, IsBool, ArrayMinLength, CheckInstance, OneOf} from '../validation';
import helpers from '../helpers'
import { throws } from 'assert';


export class ChecksRequest {
    @ArrayMinLength(1) 
    @CheckType('object') 
    @CheckInstance(Array)
    public statusCodes:number[];

    @OneOf(['https','http'])
    @CheckType('string')
    public protocol:string;

    @OneOf(['get','post','put','post'])
    @CheckType('string')
    public method:string;

    @CheckType('string')
    public url:string;

    @CheckType('number')
    @NumMinMax(1,5)
    public timeout:number;

    public id:string;

    constructor(statusCodes:number[], protocol:string, method:string, url:string, timeout:number){
        this.statusCodes = statusCodes;
        this.protocol = protocol;
        this.method = method;
        this.url = url;
        this.timeout = timeout;
        this.id = helpers.genRandomString(20);
    };

    validateCompleteChecksRequest(){
        return Validate(this, false);
    }
}
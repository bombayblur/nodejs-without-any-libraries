import {CheckType, MinLength ,ExactLength, Validate, IsBool} from '../validation/validation';
import helpers from '../lib/helpers';

export class User {

    @MinLength(0) @CheckType('string')
    public firstName?:string;

    @MinLength(0) @CheckType('string')
    public lastName?:string;

    @ExactLength(10) @CheckType('number')
    public phoneNumber?:number;

    @MinLength(8) @CheckType('string')
    public password?:string;

    @MinLength(4) @CheckType('string')
    public email?:string;

    @IsBool(true) @CheckType('boolean')
    public tos?:boolean;

    public checks?: string[];

    constructor(firstName:string | undefined, lastName:string | undefined, phoneNumber:number | undefined, password:string | undefined, email:string | undefined, tos:boolean | undefined,){
        email ? this.email = email : null ;
        firstName ? this.firstName = firstName: null;
        lastName ? this.lastName = lastName: null;
        phoneNumber ? this.phoneNumber = phoneNumber: null;
        password ? this.password = password: null;
        tos ? this.tos = tos: null;

        if(email && firstName && lastName && password && tos && phoneNumber){
            this.checks = [];
        }
    }

    // Maybe we need setters and getters too.

    hashPassword():void {
        this.password = helpers.hashPassword(this.password);
    }

    validateCompleteUser():boolean{
        return Validate(this, false);
    }

    validatePartialUser():boolean{
        return Validate(this, true);
    }


}
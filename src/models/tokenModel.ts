import {CheckType, MinLength ,ExactLength, Validate} from '../validation/validation';
import helpers from '../lib/helpers';



export class TokenRequest {
    @CheckType('string') @MinLength(8)
    public password?:string;

    @CheckType('number') @ExactLength(10)
    public phoneNumber:number;

    public hashedPassword?: string;

    public id:string;

    public expiry:number

    constructor(phoneNumber:number, password:string){
        this.hashedPassword = helpers.hashPassword(password);
        this.phoneNumber = phoneNumber;
        this.password = password;
        this.id = helpers.genRandString(20);
        this.expiry = Date.now() + 3600000;
    }

    validateRequest():boolean{
        return Validate(this, false);
    }

    generateToken():TokenRequest {
       let token:TokenRequest = this;
       delete token.hashedPassword;
       delete token.password;
       return token;
    }
}
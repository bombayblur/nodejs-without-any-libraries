
interface Flag {
    minLength?:number;
    bool?:boolean;
    type?:string;
    exactLength?:number;
    instance?:any;
    oneOf?:string[];
    arrayMinLength?:number;
    min?:number;
    max?:number;
}


interface ValidatorInterface {
    [className:string]:{
        [propertyName:string]: Flag[];
    }
}

let validatorObject:ValidatorInterface = {};


function flagInjector(className:string, propertyName:string, flag:Flag){

    let existingFlags;
    if (validatorObject[className]) {
        existingFlags = validatorObject[className][propertyName]
    }

    validatorObject[className] = {
        ...validatorObject[className],
        [propertyName]: existingFlags ? [...existingFlags, flag] : [flag]
    };

}

export function Validate(obj:any, partial:boolean):boolean{
    let className = obj.constructor.name;

    if (!validatorObject[className]) {
        return true;
    }

    let returnValue = true;

    if(partial){
        for(let property in validatorObject[className]){
            if(obj[property]){
                for(let flag of validatorObject[className][property]){
                    if(flag.bool){
                        returnValue = returnValue && obj[property] == flag.bool;
                    } else if(flag.minLength){
                        returnValue = returnValue && obj[property].toString().trim().length > flag.minLength;
                    } else if(flag.type){
                        returnValue = returnValue && typeof(obj[property]) == flag.type;
                    } else if(flag.exactLength){
                        returnValue = returnValue && obj[property].toString().trim().lenght == flag.exactLength;
                    } else if(flag.instance){
                        returnValue = returnValue && obj[property] instanceof flag.instance;
                    } else if(flag.oneOf){
                        returnValue = returnValue && flag.oneOf.indexOf(<never>obj[property]) > -1;
                    } else if(flag.arrayMinLength){
                        returnValue = returnValue && obj[property].length >= flag.arrayMinLength;
                    } else if(flag.min && flag.max) {
                        returnValue = returnValue && obj[property] >= flag.min && obj[property] <= flag.max;
                    }
                 }
            }
        }
    } else {
        for(let property in validatorObject[className]){
            for(let flag of validatorObject[className][property]){
                if(flag.bool){
                    returnValue = returnValue && obj[property] == flag.bool;
                } else if(flag.minLength){
                    returnValue = returnValue && obj[property].toString().trim().length >= flag.minLength;
                } else if(flag.type){
                    returnValue = returnValue && typeof(obj[property]) == flag.type;
                } else if(flag.exactLength){
                    returnValue = returnValue && obj[property].toString().trim().length == flag.exactLength;
                } else if(flag.instance){
                    returnValue = returnValue && obj[property] instanceof flag.instance;
                } else if(flag.oneOf){
                    returnValue = returnValue && flag.oneOf.indexOf(<never>obj[property]) > -1;
                } else if(flag.arrayMinLength){
                    returnValue = returnValue && obj[property].length >= flag.arrayMinLength;
                } else if(flag.min && flag.max) {
                    returnValue = returnValue && obj[property] >= flag.min && obj[property] <= flag.max;
                }
            }
        }
    }
    
    return returnValue;

} 


export function MinLength(length:number){
    return function(target:any, key:string){
        flagInjector(target.constructor.name, key, {minLength:length})
    }
}

export function ExactLength(length:number){
    return function(target:any, key:string){
        flagInjector(target.constructor.name, key, {exactLength:length})
    }
}

export function IsBool(bool:boolean){
    return function(target:any, key:string){
        flagInjector(target.constructor.name, key, {bool:bool});
    }
}

export function CheckType(type:string){
    return function(target:any, key:string){
        flagInjector(target.constructor.name, key, {type:type});
    }
}

export function CheckInstance(instance:any){
    return function(target:any, key:string){
        flagInjector(target.constructor.name, key, {instance:instance});
    }
}

export function OneOf(list:string[]){
    return function(target:any, key:string){
        flagInjector(target.constructor.name, key, {oneOf:list});
    }
}

export function ArrayMinLength(length:number){
    return function(target:any, key:string){
        flagInjector(target.constructor.name, key, {arrayMinLength:length});
    }
}

export function NumMinMax(num1:number, num2:number){
    return function(target:any, key:string){
        flagInjector(target.constructor.name, key, {min:num1, max:num2});
    }
}


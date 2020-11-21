
export type RoutingObject = {
    [routeName:string]:(data:RequestData, callback:ResponseHandler)=>void;
}

export type QueryStringObject = {
    phonenumber?:string,
    id?:string,
    extend?:boolean
}

export type ValidMethods = 'get' | 'put' | 'delete'| 'post'

export type HeaderObject = {
    token?: string;
}

export type RequestData = {
    header:HeaderObject,
    method: ValidMethods,
    queryString : QueryStringObject;
    path:string,
    payload:object
}

export type ResponseHandler = (statusCode:number, payload:object)=>void;


export interface Controller {
    get:Function;
    post:Function;
    put:Function;
    delete:Function;
}

export type fsCallback = (err:Error | null, data?:any)=>void;

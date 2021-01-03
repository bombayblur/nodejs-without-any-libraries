
export type RoutingObject = {
    [routeName:string]:(data:RequestData, callback:ResponseHandler)=>void;
}

export type QueryStringObject = {
    phonenumber?:string,
    id?:string,
    extend?:boolean,
    check?:string
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

// Response Handler
//
type ResponseError = {
    error:string;
}
//
type ResponseMessage = {
    message:string | object
}
//
type ResponseData = ResponseError | ResponseMessage;
//
export type ResponseHandler = (statusCode:number, data:ResponseData)=>void;
////



export interface Controller {
    get:(data:RequestData, callback:ResponseHandler)=>void;
    post:(data:RequestData, callback:ResponseHandler)=>void;
    put:(data:RequestData, callback:ResponseHandler)=>void;
    delete:(data:RequestData, callback:ResponseHandler)=>void;
}

export type fsCallback = (err:Error | null, data?:any)=>void;

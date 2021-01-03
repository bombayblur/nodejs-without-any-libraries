export default interface Log {
    checkId:string,
    localTime: string,
    localDate:string,
    timeStamp:number,
    url:string,
    method:String,
    expectedCode:number[],
    status:string,
    reason:string
}
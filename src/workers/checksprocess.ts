import data from "../lib/data";
import { ChecksRequest } from "../models/checkModel";
import http from "http";
import https from "https";
import messagingController from "../controllers/messagingController";
import { User } from "../models/userModel";
import logger from "./logprocess";
import util from 'util';

const debug = util.debuglog('CHECKSPROCESS');

class ChecksProcess {

    init(interval: number) {
        setInterval(() => {
            this.processLoop();
        }, 1000 * interval)
    }

    async processLoop(): Promise<void> {
        try{
            debug('\u001b[31m' + 'Process Cycle initiated at ' + (new Date()).toLocaleTimeString() + '\u001b[0m')
            let listOfChecks = await this.gatherChecks();
            debug('Checks Available for processing: '+ listOfChecks.map(check=>check.url));
            listOfChecks.forEach(async (checkRequest)=>{
            
            let currentTime = (new Date()).toLocaleTimeString();
            let checkName = checkRequest.url;


                try{
                    if (await this.verifyCheck(checkRequest)) {
                        debug('Initiated check for: '+checkName+' at '+ currentTime);
                        let processedCheck = await this.processCheck(checkRequest);
                        this.messageUser(checkRequest, processedCheck, ['console']);
                        await this.updateCheck(processedCheck);
                        logger.log(processedCheck);
                        debug('Concluded check for: '+checkName+' at '+currentTime);
                    }
                } catch(err){
                    debug('Throwing an Error:'+err);
                }
            });
        } catch(err){
            debug(err);
        }
    }



    messageUser(originalCheckRequest:ChecksRequest, processedCheckRequest:ChecksRequest, mode:('sms' | 'email' | 'console')[]){

        if(originalCheckRequest.status !== processedCheckRequest.status){

            if(mode.indexOf('sms')!== -1){
                messagingController.sendTextMessage(processedCheckRequest.phoneNumber!, `
                ${processedCheckRequest.url} is ${processedCheckRequest.status}
                `,(err)=>{
                    err ? debug(err) : null ;
                })
            }    

            if(mode.indexOf('email') !== -1){
               data.readFile('users', processedCheckRequest.phoneNumber!.toString(), (err, data:User)=>{
                   if(err){
                       debug(err);
                   } else {
                       messagingController.sendEmail(data.email!, `
                        ${processedCheckRequest.url} is ${processedCheckRequest.status}
                       `, 'Message from DownDetector', (err)=>{
                           if (err){
                               debug(err);
                           }
                       })
                   }
               }) 
            }

            if(mode.includes('console')){
                debug(`\u001b[31m` +`Notification: ${processedCheckRequest.url} is ${processedCheckRequest.status}` + `\u001b[0m`)
            }
        }
    }

    async gatherChecks(): Promise<ChecksRequest[]> {
        let listOfAllChecks: ChecksRequest[] = [];
        
        let list: string[] = await data.listDir('checks');
        debug('Checks dir contents:  ' + list);

        list.forEach((item,index) => {
            list[index] = item.replace('.json', '');
        });

        return new Promise((resolve, reject)=>{
            
            // We are converting a callback based async function to a promise based operation
            // In order to do that we have to keep a check on how many items were supplied to it and
            // how many items it has processed. Once the number of items supplied matches the number of items passed
            // we can succesfully resolve the promise.
            //
            let noOfItemsSupplied:number = list.length;
            let noOfItemsRetrieved:number = 0;
            list.forEach((checkId, index) => {
                data.readFile('checks', checkId, (err: Error | null, data: ChecksRequest) => {
                    if (err) {
                        reject(err);
                    } else {
                        let checkRequest = new ChecksRequest(data.statusCodes, data.protocol, data.method, data.url, data.timeout, data.phoneNumber, data.id, data.status, data.lastChecked);
                        listOfAllChecks.push(checkRequest);
                        noOfItemsRetrieved++;
                        debug('Succesfully Gathered: ' + checkRequest.url);
                        debug('Index: '+ index);

                        if(noOfItemsRetrieved == noOfItemsSupplied){
                            resolve(listOfAllChecks)
                        }
                    }
                })
            })
        })
    }

    async verifyCheck(checkRequest: ChecksRequest): Promise<Boolean> {
        return new Promise((resolve, reject) => {
            if (checkRequest.validateCompleteChecksRequest()) {
                resolve(true);
            } else {
                reject('Invalid Checks Request supplied from the database.')
            }
        });
    }

    async processCheck(checkObject: ChecksRequest): Promise<ChecksRequest> {
        return new Promise((resolve, reject) => {

            let processedCheck:ChecksRequest = Object.assign({}, checkObject);

            processedCheck.lastChecked = Date.now();

            let url = new URL(processedCheck.protocol+'://'+processedCheck.url!);

            const options = {
                protocol: processedCheck.protocol + ':',
                hostname: url.hostname,
                path: url.pathname,
                method: processedCheck.method!.toLocaleUpperCase(),
                timeout: processedCheck.timeout! * 1000
            };

            let selectedProtocol = processedCheck.protocol == 'http' ? http : https;

            const request = selectedProtocol.request(options, (res) => {

                if(processedCheck.statusCodes!.indexOf(res.statusCode!) != -1 ){
                    processedCheck.status = 'up';
                    resolve(processedCheck)
                } else {
                    processedCheck.status = 'down';
                    processedCheck.reason = `Received status code ${res.statusCode}`
                    resolve(processedCheck)
                }

            })

            request.on('error', (error:Error)=>{
                debug('request error message');
                reject(error.message)
            })

            request.on('timeout', ()=>{
                checkObject.status = 'down'
                processedCheck.reason = 'Connection Timedout'
                resolve(processedCheck)
            })

            request.end();
        })
    }

    async updateCheck(checkObject: ChecksRequest): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            data.updateFile('checks', checkObject.id!, checkObject, (err: Error | null) => {
                if (!err) {
                    resolve(true);
                } else {
                    reject('File update failled');
                }
            });
        })
    }

}

export default new ChecksProcess();
import config from "../config";
import queryString from "querystring";
import https from "https";
import { ClientRequest } from "http";
import nodemailer from 'nodemailer';

class MessagingController {
    sendTextMessage(phoneNumber:number, message:string, callback:(err:Error | null)=>void){

        let phone = typeof(phoneNumber) == 'number' && phoneNumber.toString().trim().length >= 10 && phoneNumber;
        let msg = typeof(message) == 'string' && phoneNumber.toString().length > 0 && message; 

        if(phone && msg){
            var payload = {
                'From' : config.sms.fromPhone,
                'To' : '+1'+phone,
                'Body' : msg
            }
            var stringPayload = queryString.stringify(payload);

            let requestDetails = {
                'protocol':'https:',
                'hostname':'api.twilio.com',
                'method':'POST',
                'path': '/2010-04-01/Accounts/'+config.sms.accountSid+'/Messages.json',
                'auth': config.sms.accountSid+':'+config.sms.authToken,
                'headers':{
                    'Content-Type':'application/x-www-form-urlencoded',
                    'Content-Length':Buffer.byteLength(stringPayload)
                }
            }

            var req:ClientRequest =  https.request(requestDetails, (res)=>{
                var status = res.statusCode;
                if(status == 200 || status == 201){
                    callback(null);
                } else {
                    callback(Error('Status Code: '+ status));
                }
            })

            req.on('error', (error)=>{
                callback(error);
            })

            req.write(stringPayload);

            req.end();
        } else {
            callback(Error('Invalid contact details or message supplied'));
        }

    }

    sendEmail(emailAddress:string, message:string, subject:string, callback:(err:Error | null)=>void){

        let email = typeof(emailAddress) == 'string' && emailAddress.toString().length > 0 && emailAddress;
        let msg = typeof(message) == 'string' && message.toString().length > 0 && message;
        let sub = typeof(subject) == 'string' && subject.toString().length > 0 && subject;

        if(email && msg){
            let transporter = nodemailer.createTransport({
                service:"gmail",
                auth:{
                    user:config.email.ourAddress,
                    pass:config.email.ourPass
                }
            })

            let mail = {
                from : config.email.ourAddress,
                to: email,
                subject: <string>sub,
                text: msg
            };

            transporter.sendMail(mail, (error:Error | null, info)=>{
                if(error){
                    callback(error);
                } else { 
                    callback(null);
                    console.log(JSON.stringify(info));
                }
            })
        } else {
            callback(Error('Invalid Email Address or Message'))
        }
    }
}

export default new MessagingController;
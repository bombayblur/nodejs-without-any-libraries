import https from 'https';
import http, { IncomingMessage, ServerResponse } from 'http';
import fs from 'fs';
import queryString from 'querystring';
import { StringDecoder } from 'string_decoder';
import config from '../config';
import handler from '../router/handlers';
import helpers from '../lib/helpers';
import path from 'path';
import {RequestData, RoutingObject, ValidMethods} from '../models/models';
import {QueryStringObject} from '../models/models';




class ServerProcess {

    httpsOptions = {
        key: fs.readFileSync(path.join(__dirname, '/../../https/key.pem' )),
        cert: fs.readFileSync(path.join(__dirname,'/../../https/cert.pem')) 
    }

    router:RoutingObject = {
        'ping': handler.ping,
        'users': handler.users,
        'tokens': handler.tokens,
        'checks': handler.checks,
        'notFound':handler.notFound
    }

    server(req:IncomingMessage, res:ServerResponse){

        //Parse the incoming url
        let myURL:URL = new URL(<string>req.url, `http://${req.headers.host}`);
    
        //Get the path
        let path:string = myURL.pathname
        path = path.replace(/^\/+|\/+$/g, ''); //trimming the path
    
        //Get the method
        let method:string = req.method!.toLowerCase()
    
        //Parse the queryString
        let searchParams:QueryStringObject = queryString.parse(myURL.searchParams.toString());
    
        //Get the headers
        let headers:object = req.headers;
    
        //This converts chunk data to utf-8 string
        let sDecoder = new StringDecoder('utf-8');
        let body = '';
    
        //Parse the body
        req.on('data', (chunk) => {
            body += sDecoder.write(chunk);
        });
    
        req.on('end', () => {
            body += sDecoder.end();
    
            let chosenHandler = typeof(this.router[path]) !== "undefined" ? this.router[path] : this.router.notFound;
            let bodyParseError:string = '';
    
            let data:RequestData = {
                'header': headers,
                'queryString': searchParams,
                'method' : <ValidMethods>method,
                'path': path,
                'payload': body.length > 0 ? helpers.parseToJson(body,(err:Error)=>bodyParseError = err.message): {}
            }
    
            if(bodyParseError){
                res.setHeader('content-type','application/json')
                res.writeHead(400);
                res.end(`{"error":"Error parsing the body, please check the body."}`);
            } else {
                chosenHandler(data, function(statusCode:number, payload:object){
                statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
                payload = typeof(payload) == 'object'? payload : {};
    
                let reply = JSON.stringify(payload);
    
                res.setHeader('content-type','application/json')
                res.writeHead(statusCode);
                res.end(reply);
                })
            }
    
            //This engages whichever route that was called /users or /posts
            
        })
    }

    startHttp(){
        const HttpServer = http.createServer((req,res)=>this.server(req,res));
        HttpServer.listen(config.httpPort, () => console.log(`Listening on ${config.httpPort} environment : ${config.envName}`));
    }

    startHttps(){
        const HttpsServer = https.createServer(this.httpsOptions, (req,res)=>this.server(req,res))
        HttpsServer.listen(config.httpsPort, () => console.log(`Listening on ${config.httpsPort} environment : ${config.envName}`));
    }

    init(){
        this.startHttp();
        this.startHttps()
    }
}

export default new ServerProcess;
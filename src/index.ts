import https from 'https';
import http, { IncomingMessage, ServerResponse } from 'http';
import fs from 'fs';
import queryString from 'querystring';
import { StringDecoder } from 'string_decoder';
import config from './config';
import handler, {CallbackFunction} from './lib/handlers';
import helpers from './lib/helpers';
import path from 'path';

type RequestData = {
    header:object,
    method: string,
    queryString : object;
    path:string,
    payload:object
}

const httpsOptions = {
    key: fs.readFileSync(path.join(__dirname, '/../https/key.pem' )),
    cert: fs.readFileSync(path.join(__dirname,'/../https/cert.pem')) 
}

// Universal server function
let server = function(req:IncomingMessage, res:ServerResponse){

    //Parse the incoming url
    let myURL:URL = new URL(<string>req.url, `http://${req.headers.host}`);

    //Get the path
    let path:string = myURL.pathname
    path = path.replace(/^\/+|\/+$/g, ''); //trimming the path

    //Get the method
    let method:string = req.method!.toLowerCase();

    //Parse the queryString
    let searchParams:object = queryString.parse(myURL.searchParams.toString());

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

        let chosenHandler = typeof(router[path]) !== "undefined" ? router[path] : router.notFound;

        let data:RequestData = {
            'header': headers,
            'queryString': searchParams,
            'method' : method,
            'path': path,
            'payload': body.length > 0 ? helpers.parseToJson(body,(err:Error)=>console.log(err)) : {}
        }

        //This engages whichever route that was called /users or /posts
        chosenHandler(data, function(statusCode:number, payload:object){
            statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
            payload = typeof(payload) == 'object'? payload : {};

            let reply = JSON.stringify(payload);

            res.setHeader('content-type','application/json')
            res.writeHead(statusCode);
            res.end(reply);
        })
    })
}

// The code to start the server
const HttpsServer = https.createServer(httpsOptions, (req,res)=>server(req,res))
const HttpServer = http.createServer((req,res)=>server(req,res))

// Get the server to start listening on whatever specified port.
HttpsServer.listen(config.httpsPort, () => console.log(`Listening on ${config.httpsPort} environment : ${config.envName}`));
HttpServer.listen(config.httpPort, () => console.log(`Listening on ${config.httpPort} environment : ${config.envName}`));


type Router = {
    [route:string]: CallbackFunction,
}


// Router
//
let router:Router = {
    'ping': <CallbackFunction>handler.ping,
    'users': <CallbackFunction>handler.users,
    'tokens': <CallbackFunction>handler.tokens,
    'notFound':<CallbackFunction>handler.notFound
}
// ------- X



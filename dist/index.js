"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var https_1 = __importDefault(require("https"));
var http_1 = __importDefault(require("http"));
var fs_1 = __importDefault(require("fs"));
var querystring_1 = __importDefault(require("querystring"));
var string_decoder_1 = require("string_decoder");
var config_1 = __importDefault(require("./config"));
var handlers_1 = __importDefault(require("./lib/handlers"));
var helpers_1 = __importDefault(require("./lib/helpers"));
var path_1 = __importDefault(require("path"));
var httpsOptions = {
    key: fs_1.default.readFileSync(path_1.default.join(__dirname, '/../https/key.pem')),
    cert: fs_1.default.readFileSync(path_1.default.join(__dirname, '/../https/cert.pem'))
};
// Universal server function
var server = function (req, res) {
    //Parse the incoming url
    var myURL = new URL(req.url, "http://" + req.headers.host);
    //Get the path
    var path = myURL.pathname;
    path = path.replace(/^\/+|\/+$/g, ''); //trimming the path
    //Get the method
    var method = req.method.toLowerCase();
    //Parse the queryString
    var searchParams = querystring_1.default.parse(myURL.searchParams.toString());
    //Get the headers
    var headers = req.headers;
    //This converts chunk data to utf-8 string
    var sDecoder = new string_decoder_1.StringDecoder('utf-8');
    var body = '';
    //Parse the body
    req.on('data', function (chunk) {
        body += sDecoder.write(chunk);
    });
    req.on('end', function () {
        body += sDecoder.end();
        var chosenHandler = typeof (router[path]) !== "undefined" ? router[path] : router.notFound;
        var bodyParseError = '';
        var data = {
            'header': headers,
            'queryString': searchParams,
            'method': method,
            'path': path,
            'payload': body.length > 0 ? helpers_1.default.parseToJson(body, function (err) { return bodyParseError = err.message; }) : {}
        };
        if (bodyParseError) {
            res.setHeader('content-type', 'application/json');
            res.writeHead(400);
            res.end("{\"error\":\"Error parsing the body, please check the body.\"}");
        }
        else {
            chosenHandler(data, function (statusCode, payload) {
                statusCode = typeof (statusCode) == 'number' ? statusCode : 200;
                payload = typeof (payload) == 'object' ? payload : {};
                var reply = JSON.stringify(payload);
                res.setHeader('content-type', 'application/json');
                res.writeHead(statusCode);
                res.end(reply);
            });
        }
        //This engages whichever route that was called /users or /posts
    });
};
// The code to start the server
var HttpsServer = https_1.default.createServer(httpsOptions, function (req, res) { return server(req, res); });
var HttpServer = http_1.default.createServer(function (req, res) { return server(req, res); });
// Get the server to start listening on whatever specified port.
HttpsServer.listen(config_1.default.httpsPort, function () { return console.log("Listening on " + config_1.default.httpsPort + " environment : " + config_1.default.envName); });
HttpServer.listen(config_1.default.httpPort, function () { return console.log("Listening on " + config_1.default.httpPort + " environment : " + config_1.default.envName); });
// Router
//
var router = {
    'ping': handlers_1.default.ping,
    'users': handlers_1.default.users,
    'tokens': handlers_1.default.tokens,
    'notFound': handlers_1.default.notFound
};
// ------- X
//# sourceMappingURL=index.js.map
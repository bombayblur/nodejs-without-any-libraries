"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var serverprocess_1 = __importDefault(require("./workers/serverprocess"));
var checksprocess_1 = __importDefault(require("./workers/checksprocess"));
var App = /** @class */ (function () {
    function App() {
    }
    App.prototype.init = function () {
        serverprocess_1.default.init();
        checksprocess_1.default.init(5);
        // LogProcess.routineCompressInit(10);
    };
    return App;
}());
var app = new App();
app.init();
exports.default = new App();
//# sourceMappingURL=index.js.map
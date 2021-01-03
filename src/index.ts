import Server from './workers/serverprocess';
import ChecksProcess from './workers/checksprocess';
import fsLOG from './lib/fsLog';
import LogProcess from './workers/logprocess';
import fsLog from './lib/fsLog';

class App {
     init() {
        Server.init();
        ChecksProcess.init(5);
        // LogProcess.routineCompressInit(10);
    }
}

let app = new App();
app.init();


export default new App();


import { ChecksRequest } from "../models/checkModel";
import Log from "../models/logModels";
import fsLog from "../lib/fsLog";

class Logger {
    
    public routineCompressInit(interval: number) {
        setInterval(() => {
            this.routineCompress();
        }, 1000 * interval)
    }

    public async log(processedCheck: ChecksRequest): Promise<void> {

        let log: Log = {
            checkId: processedCheck.id!,
            localTime: new Date(processedCheck.lastChecked!).toLocaleDateString('en-GB'),
            localDate: new Date(processedCheck.lastChecked!).toLocaleDateString('en-GB'),
            timeStamp: processedCheck.lastChecked!,
            url: processedCheck.url!,
            method: processedCheck.method!,
            expectedCode: processedCheck.statusCodes!,
            status: processedCheck.status!,
            reason: processedCheck.reason!
        }

        await fsLog.LogJSONEntry(log);
    }

    public async routineCompress() {
        try {
            let allLogFiles: string[] = await fsLog.ReadDirExt('.log');
            allLogFiles.forEach(async (logfile) => {
                await fsLog.CompressLogFile(logfile);
                await fsLog.ResetLogFile(logfile);
            })
        } catch (err) {
            console.log(err);
        }
    }
}

export default new Logger();

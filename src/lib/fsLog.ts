import { promisify } from 'util';
import fs from 'fs/promises';

import path from 'path';
import zlib from 'zlib';

import Log from "../models/logModels";
import { Stats } from 'fs';

const gzip = promisify(zlib.gzip);
const gunzip = promisify(zlib.gunzip);

class FileOperationsLog {

    private basedir = path.join(__dirname, '/../.logs');

    public async LogJSONEntry(log: Log) {
        let fileName: string = log.checkId;
        let filePath = this.basedir + '/' + fileName + '.log';

        let jsonString: string = JSON.stringify(log);
        let prefix: string = '';
        let suffix: string = ']'

        // This bit of code helps remove closing brackets and add commas.
        //
        try {
            let fileStat: Stats = await fs.stat(filePath);
            if (fileStat.size == 0) {
                prefix = '['
            } else {
                fs.truncate(filePath, fileStat.size - 1);
                prefix = ','
            }
        } catch (err: any) {
            if (err.code == 'ENOENT') {
                prefix = '['
            } else {
                console.log(err);
            }
        }

        let logEntry = prefix + jsonString + suffix;

        try {
            await fs.appendFile(filePath, logEntry);
            // console.log('Succesfully logged: ' + fileName + ' | Path: ' + filePath);
        } catch (err) {
            console.log(err);
        }




    }

    public async ReadDirExt(extension: string): Promise<string[]> {
        let allFiles: string[]
        allFiles = await fs.readdir(this.basedir);
        allFiles = allFiles.filter((fileName: string) => { return fileName.indexOf(extension) != -1 });
        return allFiles;

    }

    public async CompressLogFile(fileName: string) {
        let fileData: string;
        let compressedData: string;
        let concatenatedFilename: string = fileName.replace('.log', '');

        try {
            fileData = await fs.readFile(this.basedir + '/' + fileName, { encoding: 'utf-8' });
            let compressedBuffer: Buffer = await gzip(fileData)
            compressedData = compressedBuffer.toString('base64');
            await fs.writeFile(this.basedir + '/' + concatenatedFilename + '-' + Date.now() + '.gz', compressedData, { encoding: 'utf-8' });
            console.log('Compressed file available at:' + this.basedir + '/' + fileName + '-' + Date.now())
        } catch (err) {
            throw new Error(`Couldn't read the file`);
        }

    }

    public async ResetLogFile(fileName: string) {
        await fs.truncate(this.basedir + '/' + fileName)
    }

    public async DecompressFile(fileName: string) {

        const sourceFilePath = this.basedir + '/' + fileName;
        const uncompressedFilePath = this.basedir + '/' + (fileName.replace('.gz','')) + 'decompressed.log';

        try{
            let compressedFileData = await fs.readFile(sourceFilePath, {encoding:'utf-8'});
            let compressedDataBuffer = Buffer.from(compressedFileData, 'base64');
            let uncompressedData = await gunzip(compressedDataBuffer);
            await fs.writeFile(uncompressedFilePath, uncompressedData, {encoding:'utf-8'});
        } catch(err) {
            console.log(err);
        }
    }
}

export default new FileOperationsLog();
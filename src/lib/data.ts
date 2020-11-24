
import fs from 'fs';
import path from 'path';
import helpers from './helpers';

import {fsCallback} from '../models/models';

class FileOperations {
    private baseDir = path.join(__dirname, '/../.data/');

    createFile(dir:string, fileName:string, data:object, callback:fsCallback) {

        let stringData = JSON.stringify(data);
    
        fs.open(this.baseDir + '/' + dir + '/' + fileName + '.json', 'wx', (err, fd) => {
            if (err) {
                callback(err);
            } else {
                fs.writeFile(fd, stringData, {
                    encoding: 'utf8'
                }, (err) => {
                    if (err) {
                        callback(err);
                    } else {
                        fs.close(fd, (err) => {
                            if (err) {
                                callback(err);
                            } else {
                                callback(null);
                            }
                        })
                    }
                })
            }
        })
    }


    readFile(dir:string, fileName:string, callback:fsCallback) {

        // open the file
        fs.open(path.join(this.baseDir, dir, fileName) + '.json', 'r+', (err, fd) => {
    
            if (err) {
                callback(err);
            } else {
    
                //Read the file
                fs.readFile(fd, { encoding: 'utf8'}, (err, data) => {
    
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, helpers.parseToJson(data, (err:Error)=>callback(err)));
                    }
    
                    // Close the file
                    fs.close(fd, (err) => {
                        if(err){
                            callback(err);
                        }
                    })
                })
            }
        })
    }
    
    
    updateFile(dir:string, file:string, data:object, callback:fsCallback) {
        fs.open(path.join(this.baseDir, dir, file) + '.json', 'r+', (err, fd) => {
            if (err) {
                callback(err);
            } else {
                fs.truncate(path.join(this.baseDir, dir, file) + '.json', 2, (err) => {
                    if (err) {
                        callback(err);
                    } else {
                        fs.writeFile(fd, JSON.stringify(data), {
                            encoding: 'utf8',
                            flag: 'w+'
                        }, (err) => {
                            if (err) {
                                callback(err);
                            } else {
                                fs.close(fd, (err) => {
                                    callback(err);
                                })
                            }
    
                        })
                    }
                })
            }
        })
    }
    
    deleteFile(dir:string, file:string, callback:fsCallback){
        fs.unlink(path.join(this.baseDir, dir, file)+'.json', (err)=>{
            
                callback(err);
            
        })
    }
    
}

export default new FileOperations;
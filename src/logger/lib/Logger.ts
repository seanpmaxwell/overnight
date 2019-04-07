/**
 * Logging class for the Overnight project. Can print logs to the console
 * or to a file. If you want to print to a file you must specify the full
 * path. If you want to print to a file but no path is specified it will
 * print to /HOME_DIR/overnight.log
 *
 * created by Sean Maxwell Apr 5, 2019
 */

import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs';
import * as colors from 'colors';
import * as util from 'util';


export const enum LoggerModes {
    CONSOLE_MODE = 1,
    FILE_MODE,
    OFF_MODE
}

export class Logger {

    private readonly mode: number;
    private readonly filePath: string;
    private readonly DEFAULT_FILE_NAME = 'overnight.log';


    constructor(mode?: LoggerModes, filePath?: string) {

        // Set the mode, console mode is default
        if (mode) {
            this.mode = Number(mode);
        } else {
            const envMode = process.env.OVERNIGHT_LOGGER_MODE;
            this.mode = envMode ? Number(envMode) : Number(LoggerModes.CONSOLE_MODE);
        }

        // Set the file path
        if (filePath) {
            this.filePath = filePath;
        } else {
            const filePath = process.env.OVERNIGHT_LOGGER_FILEPATH;
            this.filePath = filePath || path.join(os.homedir(), this.DEFAULT_FILE_NAME);
        }
    }


    public static rmFileSync(filePath: string): void {

        try {
            fs.accessSync(filePath);
            fs.unlinkSync(filePath);
        } catch (e) {
            return;
        }
    }


    public info(content: any, printFull?: boolean): void {
        this.printLog(content, printFull || false, 'green', 'INFO: ');
    }


    public imp(content: any, printFull?: boolean): void {
        this.printLog(content, printFull || false, 'magenta', 'IMPORTANT: ');
    }


    public warn(content: any, printFull?: boolean): void {
        this.printLog(content, printFull || false, 'yellow', 'WARNING: ');
    }


    public err(content: any, printFull?: boolean): void {
        this.printLog(content, printFull || false, 'red', 'ERROR: ');
    }


    private printLog(content: any, printFull: boolean, color: string, prefix: string): void {

        if (this.mode === LoggerModes.OFF_MODE) { return; }

        if (printFull) {
            content = util.inspect(content);
        }

        const time = '[' + new Date().toISOString() + ']: ';
        content = time + content + '\n';

        if (this.mode === LoggerModes.CONSOLE_MODE) {
            content = (colors as any)[color](content);
            console.log(content);
        } else if (this.mode === LoggerModes.FILE_MODE) {
            this.writeToFile(prefix + content);
        }
    }


    private async writeToFile(content: string): Promise<void> {

        try {
            const fileExists = await this.checkExists();

            if (fileExists) {
                await this.appendFile(content);
            } else {
                await this.createNew(content);
            }

        } catch (err) {
            console.error(err);
        }
    }


    private checkExists(): Promise<boolean> {

        return new Promise(resolve => {
            fs.access(this.filePath, err => resolve(!err));
        });
    }


    private appendFile(content: string): Promise<null | Error> {

        return new Promise((resolve, reject) => {
            fs.appendFile(this.filePath, content, err => {
                err ? reject(err) : resolve();
            });
        });
    }


    private createNew(content: string): Promise<void | Error> {

        return new Promise((resolve, reject) => {
            fs.writeFile(this.filePath, content, err => {
                err ? reject(err) : resolve();
            });
        });
    }
}

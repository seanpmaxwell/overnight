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
    CONSOLE_MODE = 'console',
    FILE_MODE = 'file',
    OFF_MODE = 'off'
}

export class Logger {

    private readonly mode: 'console' | 'file' | 'off';
    private readonly filePath: string;
    private readonly DEFAULT_FILE_NAME = 'overnight.log';


    constructor(mode?: 'console' | 'file' | 'off', filePath?: string) {

        // Set the mode, console mode is default
        if (mode) {
            this.mode = mode;
        } else {
            const envMode: any = process.env.OVERNIGHT_LOGGER_MODE;
            this.mode = envMode || LoggerModes.CONSOLE_MODE;
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

        if (this.mode === LoggerModes.OFF_MODE) {
            return;
        }
        if (printFull) {
            content = util.inspect(content);
        }

        // Append time
        const time = '[' + new Date().toISOString() + ']: ';
        content = time + content;

        // Print to console or file
        if (this.mode === LoggerModes.CONSOLE_MODE) {
            content = (colors as any)[color](content);
            console.log(content);
        } else if (this.mode === LoggerModes.FILE_MODE) {
            this.writeToFile(prefix + content + '\n');
        }
    }


    private async writeToFile(content: string): Promise<void> {

        try {
            const exists = this.checkExists();

            if (exists) {
                fs.appendFileSync(this.filePath, content);
            } else {
                fs.writeFileSync(this.filePath, content);
            }

        } catch (err) {
            console.error(err);
        }
    }


    private checkExists(): boolean {

        try {
            fs.accessSync(this.filePath);
            return true;
        } catch (e) {
            return false;
        }
    }
}

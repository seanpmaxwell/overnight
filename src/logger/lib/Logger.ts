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
import { LoggerModes, CustomLogger } from './tools';



type LoggerModeOpts = LoggerModes.CONSOLE | LoggerModes.FILE | LoggerModes.OFF;

export class Logger {

    private _mode: LoggerModeOpts;
    private _filePath: string;
    private _rmTimestamp = false;
    private _customLogger: CustomLogger | null = null;
    private _useExternalTool = false;

    private readonly DEFAULT_FILE_NAME = 'overnight.log';
    private readonly EXTERNAL_LOGGER_ERR = 'Use custom logger set to true, but no logger ' +
        'was provided.';


    constructor(mode?: LoggerModeOpts, filePath?: string, rmTimestamp?: boolean,
                customLogger?: CustomLogger, useExternalTool?: boolean) {

        // Set the mode, 'console' mode is default
        if (mode) {
            this._mode = mode;
        } else {
            const envMode: any = process.env.OVERNIGHT_LOGGER_MODE;
            this._mode = envMode || LoggerModes.CONSOLE;
        }

        // Set the file path, home dir is default
        if (filePath) {
            this._filePath = filePath;
        } else {
            const filePath = process.env.OVERNIGHT_LOGGER_FILEPATH;
            this._filePath = filePath || path.join(os.homedir(), this.DEFAULT_FILE_NAME);
        }

        // Set the timestamp, default
        if (typeof rmTimestamp === 'boolean') {
            this._rmTimestamp = rmTimestamp;
        } else if (rmTimestamp === undefined) {
            const remove = process.env.OVERNIGHT_LOGGER_RM_TIMESTAMP;
            if (remove === 'true') {
                this._rmTimestamp = true;
            } else if (remove === 'false') {
                this._rmTimestamp = false;
            }
        }

        // Set the external tool
        if (customLogger) {
            this._customLogger = customLogger;
        }

        // Set the external tool to on or off
        if (typeof useExternalTool === 'boolean') {
            this._useExternalTool = useExternalTool;
        } else if (useExternalTool === undefined) {
            const useExternal = process.env.OVERNIGHT_LOGGER_USE_EXTERNAL_TOOL;
            if (useExternal === 'true') {
                this._useExternalTool = true;
            } else if (useExternal === 'false') {
                this._useExternalTool = false;
            }
        }
    }

    public get mode(): LoggerModeOpts {
        return this._mode;
    }

    public set mode(mode: LoggerModeOpts) {
        this._mode = mode;
    }

    public get filePath(): string {
        return this._filePath;
    }

    public set filePath(filePath: string) {
        this._filePath = filePath;
    }

    public get rmTimestamp(): boolean {
        return this._rmTimestamp;
    }

    public set rmTimestamp(rmTimestamp: boolean) {
        this._rmTimestamp = rmTimestamp;
    }

    public set customLogger(customLogger: CustomLogger | null) {
        this._customLogger = customLogger;
    }

    public get customLogger(): CustomLogger | null {
        return this._customLogger;
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

        if (this.mode === LoggerModes.OFF) {
            return;
        }

        if (printFull) {
            content = util.inspect(content);
        }

        // Append time
        if (!this.rmTimestamp) {
            const time = '[' + new Date().toISOString() + ']: ';
            content = time + content;
        }

        // Print to console, file, or external tool
        if (this.mode === LoggerModes.CONSOLE) {
            content = (colors as any)[color](content);
            console.log(content);
        } else if (this.mode === LoggerModes.FILE) {
            this.writeToFile(prefix + content + '\n');
        } else if (this.mode === LoggerModes.EXTERNAL) {
            if (this._customLogger) {
                this._customLogger.sendLog(content);
            } else {
                throw Error(this.EXTERNAL_LOGGER_ERR);
            }
        }
    }


    private writeToFile(content: string): void {

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

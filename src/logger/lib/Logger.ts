/**
 * Logging class for the Overnight project. Can print logs to the console
 * or to a file. If you want to print to a file you must specify the full
 * path. If you want to print to a file but no path is specified it will
 * print to /HOME_DIR/overnight.log
 *
 * created by Sean Maxwell Apr 5, 2019
 */

import * as colors from 'colors';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import * as util from 'util';
import { LoggerModes, loggerModeArr } from './constants';



export type LoggerModeOptions = LoggerModes.CONSOLE | LoggerModes.FILE | LoggerModes.CUSTOM |
    LoggerModes.OFF;

export interface ICustomLogger {
    sendLog(content: any): void;
}


export class Logger {

    private static _stMode = Logger.initMode();
    private static _stFilePath = Logger.initFilePath();
    private static _stRmTimestamp = Logger.initRmTimestamp();

    private _mode = Logger._stMode;
    private _filePath = Logger._stFilePath;
    private _rmTimestamp = Logger._stRmTimestamp;
    private _customLogger: ICustomLogger | null = null;

    public static readonly DEFAULT_LOG_FILE_NAME = 'overnight.log';
    private readonly CUSTOM_LOGGER_ERR = 'Custom logger mode set to true, but no custom logger ' +
        'was provided.';


    constructor(mode?: LoggerModeOptions, filePath?: string, rmTimestamp?: boolean,
                customLogger?: ICustomLogger) {
        if (mode) {
            this._mode = mode;
        }
        if (filePath) {
            this._filePath = filePath;
        }
        if (rmTimestamp) {
            this._rmTimestamp = rmTimestamp;
        }
        if (customLogger) {
            this._customLogger = customLogger;
        }
    }


    /********************************************************************************************
     *                      Initialize values from env variables
     ********************************************************************************************/


    private static initFilePath(): string {
        return process.env.OVERNIGHT_LOGGER_FILEPATH || path.join(os.homedir(),
            Logger.DEFAULT_LOG_FILE_NAME);
    }


    private static initMode(): LoggerModeOptions {
        let mode = LoggerModes.CONSOLE;
        loggerModeArr.forEach((val: LoggerModeOptions) => {
            if (process.env.OVERNIGHT_LOGGER_MODE === val) {
                mode = val;
            }
        });
        return mode;
    }


    private static initRmTimestamp(): boolean {
        return process.env.OVERNIGHT_LOGGER_RM_TIMESTAMP === 'true';
    }


    /********************************************************************************************
     *                                 Getters/Setters
     ********************************************************************************************/

    public static get mode(): LoggerModeOptions {
        return this._stMode as LoggerModeOptions;
    }

    public static set mode(mode: LoggerModeOptions) {
        this._stMode = mode;
    }

    public get mode(): LoggerModeOptions {
        return this.mode;
    }

    public set mode(mode: LoggerModeOptions) {
        this._mode = mode;
    }

    public static get filePath(): string {
        return this._filePath; // pick up here
    }

    public static set filePath(filePath: string) {
        this._filePath = filePath;
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

    public set customLogger(customLogger: ICustomLogger | null) {
        this._customLogger = customLogger;
    }

    public get customLogger(): ICustomLogger | null {
        return this._customLogger;
    }


    /********************************************************************************************
     *                                 Static Methods
     ********************************************************************************************/

    public static Info(content: any, printFull?: boolean) {

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


    /********************************************************************************************
     *                                   Helpers
     ********************************************************************************************/

    private static printLog(content: any, printFull: boolean, color: string, prefix: string): void {
        if (this.mode === LoggerModes.OFF) {
            return;
        }
        if (printFull) {
            content = util.inspect(content);
        }
        if (!this.rmTimestamp) {
            const time = '[' + new Date().toISOString() + ']: ';
            content = time + content;
        }
        // Print to console, file, or external tool
        if (this.mode === LoggerModes.CONSOLE) {
            content = (colors as any)[color](content);
            // tslint:disable-next-line
            console.log(content);
        } else if (this.mode === LoggerModes.FILE) {
            this.writeToFile(prefix + content + '\n');
        } else if (this.mode === LoggerModes.CUSTOM) {
            if (this._customLogger) {
                this._customLogger.sendLog(content);
            } else {
                throw Error(this.CUSTOM_LOGGER_ERR);
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
            // tslint:disable-next-line
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

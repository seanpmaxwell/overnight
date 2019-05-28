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
import { LoggerModes, loggerModeArr, ILogType, ICustomLogger, LoggerModeOptions, INFO, IMP, WARN,
    ERR, DEFAULT_LOG_FILE_NAME } from './constants';


export class Logger {

    private static _mode = Logger.initMode();
    private static _filePath = Logger.initFilePath();
    private static _rmTimestamp = Logger.initRmTimestamp();
    private static _customLogger: ICustomLogger | null = null;

    private _mode = Logger.initMode();
    private _filePath = Logger.initFilePath();
    private _rmTimestamp = Logger.initRmTimestamp();
    private _customLogger: ICustomLogger | null = null;

    private static readonly CUSTOM_LOGGER_ERR = 'Custom logger mode set to true, but no ' +
        'custom logger was provided.';


    constructor(
        mode?: LoggerModeOptions,
        filePath?: string,
        rmTimestamp?: boolean,
        customLogger?: ICustomLogger,
    ) {
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
        const filePath = path.join(os.homedir(), DEFAULT_LOG_FILE_NAME);
        return process.env.OVERNIGHT_LOGGER_FILEPATH || filePath;
    }


    private static initMode(): LoggerModeOptions {
        for (const val of loggerModeArr) {
            if (process.env.OVERNIGHT_LOGGER_MODE === val) {
                return val;
            }
        }
        return LoggerModes.Console;
    }


    private static initRmTimestamp(): boolean {
        return process.env.OVERNIGHT_LOGGER_RM_TIMESTAMP === 'true';
    }


    /********************************************************************************************
     *                                 Getters/Setters
     ********************************************************************************************/

    // Mode

    public static get mode(): LoggerModeOptions {
        return Logger._mode;
    }

    public static set mode(mode: LoggerModeOptions) {
        Logger._mode = mode;
    }

    public get mode(): LoggerModeOptions {
        return this._mode;
    }

    public set mode(mode: LoggerModeOptions) {
        this._mode = mode;
    }

    // File Path

    public static get filePath(): string {
        return Logger._filePath;
    }

    public static set filePath(filePath: string) {
        Logger._filePath = filePath;
    }

    public get filePath(): string {
        return this._filePath;
    }

    public set filePath(filePath: string) {
        this._filePath = filePath;
    }

    // Remove Timestamp

    public static get rmTimestamp(): boolean {
        return Logger._rmTimestamp;
    }

    public static set rmTimestamp(rmTimestamp: boolean) {
        Logger._rmTimestamp = rmTimestamp;
    }

    public get rmTimestamp(): boolean {
        return this._rmTimestamp;
    }

    public set rmTimestamp(rmTimestamp: boolean) {
        this._rmTimestamp = rmTimestamp;
    }

    // Custom Logger

    public static set customLogger(customLogger: ICustomLogger | null) {
        Logger._customLogger = customLogger;
    }

    public static get customLogger(): ICustomLogger | null {
        return Logger._customLogger;
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
        Logger.PrintLogHelper(content, printFull || false, INFO);
    }


    public static Imp(content: any, printFull?: boolean) {
        Logger.PrintLogHelper(content, printFull || false, IMP);
    }


    public static Warn(content: any, printFull?: boolean) {
        Logger.PrintLogHelper(content, printFull || false, WARN);
    }


    public static Err(content: any, printFull?: boolean) {
        Logger.PrintLogHelper(content, printFull || false, ERR);
    }


    private static PrintLogHelper(content: any, printFull: boolean, logType: ILogType): void {
        Logger.PrintLog(content, printFull, logType, Logger.mode, Logger.rmTimestamp,
            Logger.filePath, Logger.customLogger);
    }


    /********************************************************************************************
     *                                 Non-static Methods
     ********************************************************************************************/

    public info(content: any, printFull?: boolean): void {
        this.printLogHelper(content, printFull || false, INFO);
    }


    public imp(content: any, printFull?: boolean): void {
        this.printLogHelper(content, printFull || false, IMP);
    }


    public warn(content: any, printFull?: boolean): void {
        this.printLogHelper(content, printFull || false, WARN);
    }


    public err(content: any, printFull?: boolean): void {
        this.printLogHelper(content, printFull || false, ERR);
    }


    private printLogHelper(content: any, printFull: boolean, logType: ILogType): void {
        Logger.PrintLog(content, printFull, logType, this.mode, this.rmTimestamp, this.filePath,
            this.customLogger);
    }


    /********************************************************************************************
     *                                   Helpers
     ********************************************************************************************/

    /**
     * Print the actual log using the provided settings.
     * @param content
     * @param printFull
     * @param logType
     * @param mode
     * @param rmTimestamp
     * @param filePath
     * @constructor
     */
    private static PrintLog(
        content: any,
        printFull: boolean,
        logType: ILogType,
        mode: LoggerModeOptions,
        rmTimestamp: boolean,
        filePath: string,
        customLogger: ICustomLogger | null,
    ): void {

        if (mode === LoggerModes.Off) {
            return;
        }
        // Update content
        if (printFull) {
            content = util.inspect(content);
        }
        if (!rmTimestamp) {
            const time = '[' + new Date().toISOString() + ']: ';
            content = time + content;
        }
        // Print log
        if (mode === LoggerModes.Console) {
            content = (colors as any)[logType.color](content);
            // tslint:disable-next-line
            console.log(content);
        } else if (mode === LoggerModes.File) {
            Logger.WriteToFile(logType.prefix + content + '\n', filePath);
        } else if (mode === LoggerModes.Custom) {
            if (customLogger) {
                customLogger.sendLog(content);
            } else {
                throw Error(Logger.CUSTOM_LOGGER_ERR);
            }
        }
    }

    /**
     * Write logs a file instead of the console.
     * @param content
     * @param filePath
     * @constructor
     */
    private static WriteToFile(content: string, filePath: string): void {
        try {
            const fileExists = Logger.CheckExists(filePath);
            if (fileExists) {
                fs.appendFileSync(filePath, content);
            } else {
                fs.writeFileSync(filePath, content);
            }
        } catch (err) {
            // tslint:disable-next-line
            console.error(err);
        }
    }


    /**
     * Check if a file exists at the file path.
     * @param filePath
     * @constructor
     */
    private static CheckExists(filePath: string): boolean {
        try {
            fs.accessSync(filePath);
            return true;
        } catch (e) {
            return false;
        }
    }
}

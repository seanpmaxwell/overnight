/**
 * Loggers modes and External Tool Interface
 *
 * created by Sean Maxwell April 10, 2019
 */


export const DEFAULT_LOG_FILE_NAME = 'overnight.log';


/***********************************************************************************************
 *                                       Logger Modes
 **********************************************************************************************/

export const enum LoggerModes {
    Console = 'CONSOLE',
    File = 'FILE',
    Custom = 'CUSTOM',
    Off = 'OFF',
}

export const loggerModeArr = [LoggerModes.Console, LoggerModes.File, LoggerModes.Custom,
    LoggerModes.Off];

export type LoggerModeOptions = LoggerModes.Console | LoggerModes.File | LoggerModes.Custom |
    LoggerModes.Off;


/***********************************************************************************************
 *                                   Customer Logger Interface
 **********************************************************************************************/

export interface ICustomLogger {
    sendLog(content: any): void;
}


/***********************************************************************************************
 *                                       Log type values
 **********************************************************************************************/

export interface ILogType {
    color: 'green' | 'magenta' | 'yellow' | 'red';
    prefix: 'INFO' | 'IMPORTANT' | 'WARNING' | 'ERROR';
}

export const INFO: ILogType = {
    color: 'green',
    prefix: 'INFO',
};

export const IMP: ILogType = {
    color: 'magenta',
    prefix: 'IMPORTANT',
};

export const WARN: ILogType = {
    color: 'yellow',
    prefix: 'WARNING',
};

export const ERR: ILogType = {
    color: 'red',
    prefix: 'ERROR',
};

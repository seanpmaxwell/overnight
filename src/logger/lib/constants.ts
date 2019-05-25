/**
 * Loggers modes and External Tool Interface
 *
 * created by Sean Maxwell April 10, 2019
 */


/***********************************************************************************************
 *                                       Logger Modes
 **********************************************************************************************/

export const enum LoggerModes {
    CONSOLE = 'console',
    FILE = 'file',
    CUSTOM = 'custom',
    OFF = 'off',
}

export const loggerModeArr = [LoggerModes.CONSOLE, LoggerModes.FILE, LoggerModes.CUSTOM,
    LoggerModes.OFF];


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

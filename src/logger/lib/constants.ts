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

interface ILogType {
    color: 'green' | 'magenta' | 'yellow' | 'red';
    prepend: 'INFO' | 'IMPORTANT' | 'WARNING' | 'ERROR';
}

export const INFO: ILogType = {
    color: 'green',
    prepend: 'INFO',
};

export const IMP: ILogType = {
    color: 'magenta',
    prepend: 'IMPORTANT',
};

export const WARN: ILogType = {
    color: 'yellow',
    prepend: 'WARNING',
}

// pick up here

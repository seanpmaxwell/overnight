/**
 * Loggers modes and External Tool Interface
 *
 * created by Sean Maxwell April 10, 2019
 */

export const enum LoggerModes {
    CONSOLE = 'console',
    FILE = 'file',
    EXTERNAL = 'external',
    OFF = 'off',
}

export interface ICustomLogger {
    sendLog(content: any): void;
}

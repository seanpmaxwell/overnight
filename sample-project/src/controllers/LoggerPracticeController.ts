/**
 * Controller to test OvernightJS's Logger package.
 *
 * created by Sean Maxwell April 6, 2019
 */

import { OK } from 'http-status-codes';
import { Controller, Get } from '@overnightjs/core';
import { Logger, LoggerModes } from '@overnightjs/logger';
import { Request, Response } from 'express';
import * as path from 'path';
import CustomLoggerTool from './other/CustomLoggerTool';


@Controller('logger')
export class LoggerPracticeController {

    private readonly customLoggerTool: CustomLoggerTool;


    constructor() {
        this.customLoggerTool = new CustomLoggerTool();
    }


    // Console

    @Get('console/:msg')
    private printLogsConsole(req: Request, res: Response) {
        process.env.OVERNIGHT_LOGGER_MODE = LoggerModes.Console;
        const logger = new Logger();
        logger.info(req.params.msg);
        logger.imp(req.params.msg);
        logger.warn(req.params.msg);
        logger.err(req.params.msg);
        logger.err(new Error('printing out an error'));
        logger.err(new Error('printing out an error full'), true);
        return res.status(OK).json({
            message: 'console_mode',
        });
    }


    @Get('static/console/:msg')
    private stPrintLogsConsole(req: Request, res: Response) {
        Logger.Info(req.params.msg);
        Logger.Imp(req.params.msg);
        Logger.Warn(req.params.msg);
        Logger.Err(req.params.msg);
        Logger.Err(new Error('printing out an error'));
        Logger.Err(new Error('printing out an error full'), true);
        return res.status(OK).json({
            message: 'static_console_mode',
        });
    }


    // Custom File Path

    @Get('file/:msg')
    private printLogsFile(req: Request, res: Response) {
        const logFilePath = path.join(__dirname, '../../sampleProject.log');
        process.env.OVERNIGHT_LOGGER_FILEPATH = logFilePath;
        const logger = new Logger(LoggerModes.File);
        logger.info(req.params.msg);
        logger.imp(req.params.msg);
        logger.warn(req.params.msg);
        logger.err(req.params.msg);
        logger.err(new Error('printing out an error'));
        logger.err(new Error('printing out an error full'), true);
        return res.status(OK).json({
            message: 'file_mode',
        });
    }


    @Get('static/file/:msg')
    private stPrintLogsFile(req: Request, res: Response) {
        const logFilePath = path.join(__dirname, '../../sampleProject.log');
        Logger.filePath = logFilePath;
        Logger.mode = LoggerModes.File;
        Logger.Info(req.params.msg);
        Logger.Imp(req.params.msg);
        Logger.Warn(req.params.msg);
        Logger.Err(req.params.msg);
        Logger.Err(new Error('printing out an error'));
        Logger.Err(new Error('printing out an error full'), true);
        return res.status(OK).json({
            message: 'static_file_mode',
        });
    }


    // Default file path

    @Get('defaultFilePath/:msg')
    private defaultFilePath(req: Request, res: Response) {
        process.env.OVERNIGHT_LOGGER_FILEPATH = '';
        process.env.OVERNIGHT_LOGGER_MODE = LoggerModes.File;
        const logger = new Logger();
        logger.info(req.params.msg);
        logger.imp(req.params.msg);
        logger.warn(req.params.msg);
        logger.err(req.params.msg);
        return res.status(OK).json({
            message: 'default_file_path',
        });
    }


    @Get('static/defaultFilePath/:msg')
    private stDefaultFilePath(req: Request, res: Response) {
        Logger.Info(req.params.msg);
        Logger.Imp(req.params.msg);
        Logger.Warn(req.params.msg);
        Logger.Err(req.params.msg);
        return res.status(OK).json({
            message: 'static_default_file_path',
        });
    }


    // Off

    @Get('off/:msg')
    private printLogsOff(req: Request, res: Response) {
        const logger = new Logger(LoggerModes.Off);
        logger.info(req.params.msg);
        logger.imp(req.params.msg);
        logger.warn(req.params.msg);
        logger.err(req.params.msg);
        return res.status(OK).json({
            message: 'off_mode',
        });
    }


    @Get('static/off/:msg')
    private stPrintLogsOff(req: Request, res: Response) {
        Logger.mode = LoggerModes.Off;
        Logger.Info(req.params.msg);
        Logger.Imp(req.params.msg);
        Logger.Warn(req.params.msg);
        Logger.Err(req.params.msg);
        return res.status(OK).json({
            message: 'static_off_mode',
        });
    }


    // Defaults

    @Get('defaults/:msg')
    private testDefaults(req: Request, res: Response) {
        process.env.OVERNIGHT_LOGGER_FILEPATH = '';
        process.env.OVERNIGHT_LOGGER_MODE = '';
        const logger = new Logger();
        logger.info(req.params.msg);
        logger.imp(req.params.msg);
        logger.warn(req.params.msg);
        logger.err(req.params.msg);
        return res.status(OK).json({
            message: 'test_defaults',
        });
    }


    // Not this could've been changed if other routes are fired first
    @Get('static/defaults/:msg')
    private stTestDefaults(req: Request, res: Response) {
        Logger.Info(req.params.msg);
        Logger.Imp(req.params.msg);
        Logger.Warn(req.params.msg);
        Logger.Err(req.params.msg);
        return res.status(OK).json({
            message: 'static_test_defaults',
        });
    }


    // Custom Logger

    @Get('useCustomLogger/:msg')
    private useCustomLogger(req: Request, res: Response) {
        const logger = new Logger(LoggerModes.Custom, '', true, this.customLoggerTool);
        logger.rmTimestamp = true;
        logger.info(req.params.msg);
        logger.imp(req.params.msg);
        logger.warn(req.params.msg);
        logger.err(req.params.msg);
        return res.status(OK).json({
            message: 'default_file_path',
        });
    }


    @Get('static/useCustomLogger/:msg')
    private stUseCustomLogger(req: Request, res: Response) {
        Logger.mode = LoggerModes.Custom;
        Logger.filePath = '';
        Logger.rmTimestamp = true;
        Logger.customLogger = this.customLoggerTool;
        Logger.Info(req.params.msg);
        Logger.Imp(req.params.msg);
        Logger.Warn(req.params.msg);
        Logger.Err(req.params.msg);
        return res.status(OK).json({
            message: 'static_default_file_path',
        });
    }
}

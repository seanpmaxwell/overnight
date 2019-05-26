/**
 * Controller to test OvernightJS's Logger package.
 *
 * created by Sean Maxwell April 6, 2019
 */

import {Controller, Get} from '@overnightjs/core';
import {Logger, LoggerModes} from '@overnightjs/logger';
import {Request, Response} from 'express';
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
    private printLogsConsole(req: Request, res: Response): void {
        process.env.OVERNIGHT_LOGGER_MODE = LoggerModes.CONSOLE;
        const logger = new Logger();
        logger.info(req.params.msg);
        logger.imp(req.params.msg);
        logger.warn(req.params.msg);
        logger.err(req.params.msg);
        logger.err(new Error('printing out an error'));
        logger.err(new Error('printing out an error full'), true);
        res.status(200).json({msg: 'console_mode'});
    }


    @Get('static/console/:msg')
    private stPrintLogsConsole(req: Request, res: Response): void {
        process.env.OVERNIGHT_LOGGER_MODE = LoggerModes.CONSOLE;
        Logger.Info(req.params.msg);
        Logger.Imp(req.params.msg);
        Logger.Warn(req.params.msg);
        Logger.Err(req.params.msg);
        Logger.Err(new Error('printing out an error'));
        Logger.Err(new Error('printing out an error full'), true);
        res.status(200).json({msg: 'console_mode'});
    }


    // File

    // pick up here
    @Get('file/:msg')
    private printLogsFile(req: Request, res: Response): void {
        const logFilePath = path.join(__dirname, '../../sampleProject.log');
        process.env.OVERNIGHT_LOGGER_FILEPATH = logFilePath;
        const logger = new Logger(LoggerModes.FILE);
        logger.info(req.params.msg);
        logger.imp(req.params.msg);
        logger.warn(req.params.msg);
        logger.err(req.params.msg);
        logger.err(new Error('printing out an error'));
        logger.err(new Error('printing out an error full'), true);
        res.status(200).json({msg: 'file_mode'});
    }


    @Get('static/file/:msg')
    private stPrintLogsFile(req: Request, res: Response): void {
        const logFilePath = path.join(__dirname, '../../sampleProject.log');
        process.env.OVERNIGHT_LOGGER_FILEPATH = logFilePath;
        Logger.mode = LoggerModes.FILE;
        Logger.Info(req.params.msg);
        Logger.Imp(req.params.msg);
        Logger.Warn(req.params.msg);
        Logger.Err(req.params.msg);
        Logger.Err(new Error('printing out an error'));
        Logger.Err(new Error('printing out an error full'), true);
        res.status(200).json({msg: 'file_mode'});
    }


    // Off

    @Get('off/:msg')
    private printLogsOff(req: Request, res: Response): void {
        const logger = new Logger(LoggerModes.OFF);
        logger.info(req.params.msg);
        logger.imp(req.params.msg);
        logger.warn(req.params.msg);
        logger.err(req.params.msg);
        res.status(200).json({msg: 'off_mode'});
    }


    @Get('static/off/:msg')
    private stPrintLogsOff(req: Request, res: Response): void {
        Logger.mode = LoggerModes.OFF;
        Logger.Info(req.params.msg);
        Logger.Imp(req.params.msg);
        Logger.Warn(req.params.msg);
        Logger.Err(req.params.msg);
        res.status(200).json({msg: 'off_mode'});
    }


    // Defaults

    @Get('defaults/:msg')
    private testDefaults(req: Request, res: Response): void {
        process.env.OVERNIGHT_LOGGER_FILEPATH = '';
        process.env.OVERNIGHT_LOGGER_MODE = '';
        const logger = new Logger();
        logger.info(req.params.msg);
        logger.imp(req.params.msg);
        logger.warn(req.params.msg);
        logger.err(req.params.msg);
        res.status(200).json({msg: 'test_defaults'});
    }


    @Get('defaultFilePath/:msg')
    private defaultFilePath(req: Request, res: Response): void {
        process.env.OVERNIGHT_LOGGER_FILEPATH = '';
        process.env.OVERNIGHT_LOGGER_MODE = LoggerModes.FILE;
        const logger = new Logger();
        logger.info(req.params.msg);
        logger.imp(req.params.msg);
        logger.warn(req.params.msg);
        logger.err(req.params.msg);
        res.status(200).json({msg: 'default_file_path'});
    }


    @Get('useCustomLogger/:msg')
    private useCustomLogger(req: Request, res: Response): void {
        const logger = new Logger(LoggerModes.CUSTOM, '', true, this.customLoggerTool);
        logger.rmTimestamp = true;
        logger.info(req.params.msg);
        logger.imp(req.params.msg);
        logger.warn(req.params.msg);
        logger.err(req.params.msg);
        res.status(200).json({msg: 'default_file_path'});
    }
}

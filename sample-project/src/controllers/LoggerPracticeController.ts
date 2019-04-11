/**
 * Controller to test OvernightJS's Logger package.
 *
 * created by Sean Maxwell April 6, 2019
 */

import * as path from 'path';
import { Request, Response } from 'express';
import { Controller, Get } from '@overnightjs/core';
import { Logger, LoggerModes } from '@overnightjs/logger';


@Controller('api/logger')
export class LoggerPracticeController {


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


    @Get('off/:msg')
    private printLogsOff(req: Request, res: Response): void {

        const logger = new Logger(LoggerModes.OFF);

        logger.info(req.params.msg);
        logger.imp(req.params.msg);
        logger.warn(req.params.msg);
        logger.err(req.params.msg);

        res.status(200).json({msg: 'off_mode'});
    }


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


    @Get('userCustomLogger/:msg')
    private useCustomLogger(req: Request, res: Response): void {

        process.env.OVERNIGHT_LOGGER_FILEPATH = '';
        process.env.OVERNIGHT_LOGGER_MODE = LoggerModes.EXTERNAL;

        const logger = new Logger();

        logger.info(req.params.msg);
        logger.imp(req.params.msg);
        logger.warn(req.params.msg);
        logger.err(req.params.msg);

        res.status(200).json({msg: 'default_file_path'});
    }
}

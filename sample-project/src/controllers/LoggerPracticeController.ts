/**
 * Controller to test OvernightJS's Logger package.
 *
 * created by Sean Maxwell April 6, 2019
 */

import * as path from 'path';
import {Request, Response} from 'express';
import {Controller, Get} from '@overnightjs/core';
import {Logger, LoggerModes} from '@overnightjs/logger';


@Controller('api/logger')
export class LoggerPracticeController {


    @Get('console/:msg')
    private printLogsConsole(req: Request, res: Response): void {

        const logFilePath = path.join(__dirname, '../../sampleProject.log');
        process.env.OVERNIGHT_LOGGER_MODE = '1';
        process.env.OVERNIGHT_LOGGER_FILEPATH = logFilePath;

        const logger = new Logger();

        logger.info(req.params.msg);
        logger.imp(req.params.msg);
        logger.warn(req.params.msg);
        logger.err(req.params.msg);

        logger.err(new Error('printing out an error'));
        logger.err(new Error('printing out an error full'), true);

        res.status(200).json({msg: 'whatever'});
    }


    @Get('file/:msg')
    private printLogsFile(req: Request, res: Response): void {

        const logFilePath = path.join(__dirname, '../../sampleProject.log');
        process.env.OVERNIGHT_LOGGER_FILEPATH = logFilePath;

        const logger = new Logger(LoggerModes.FILE_MODE);

        logger.info(req.params.msg);
        logger.imp(req.params.msg);
        logger.warn(req.params.msg);
        logger.err(req.params.msg);

        logger.err(new Error('printing out an error'));
        logger.err(new Error('printing out an error full'), true);

        res.status(200).json({msg: 'whatever'});
    }
}

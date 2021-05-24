/**
 * Class to test middleware being passed at the class level.
 *
 * created by Wekoslav Stefanovski, 1/4/2020
 */

import { Controller, ClassErrorMiddleware, Get, Post, ErrorMiddleware } from '@overnightjs/core';
import { Logger } from '@overnightjs/logger';
import { Request, Response } from 'express';
import { logErrorAndStop, logErrorAndContinue } from './other/CustomErrorMiddleware';
import { Wrapper } from '../../../src/core/lib';
import { asyncWrapper } from './other/wrapperFunctions';

@Controller('api/boom')
@ClassErrorMiddleware(logErrorAndStop)
export class ErrorDecoratorController {


    @Get()
    @ErrorMiddleware(logErrorAndContinue)
    public get(req: Request, res: Response): any {
        Logger.Info('get called');
        throw Error('Error in get request');
    }


    @Post()
    public post(req: Request, res: Response): any {
        Logger.Info('post called');
        throw Error('Error in post request');
    }


    @Get('async')
    @Wrapper(asyncWrapper)
    public async getAsync(req: Request, res: Response): Promise<any> {
        Logger.Info('async get called');
        await delay(1000);
        Logger.Info('waited a second');
        throw Error('Error in async get request');
    }
}

const delay = (ms: number = 1000) => {
    return new Promise((resolve, reject) => setTimeout(() => resolve(), ms));
};

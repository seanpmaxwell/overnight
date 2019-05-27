/**
 * ChildA2Controller
 *
 * created by Sean Maxwell May 25, 2019
 */

import { Controller, Get } from '@overnightjs/core';
import { Logger } from '@overnightjs/logger';
import { Request, Response } from 'express';
import { OK } from 'http-status-codes';


@Controller('child-a2')
export class ChildA2Controller {


    @Get()
    private get(req: Request, res: Response) {
        const message = 'Hi I\'m the child A2 controller';
        Logger.Info(message);
        return res.status(OK).json({message});
    }
}

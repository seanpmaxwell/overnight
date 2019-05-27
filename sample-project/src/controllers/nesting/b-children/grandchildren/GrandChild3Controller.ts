/**
 * GrandChild3Controller
 *
 * created by Sean Maxwell May 26, 2019
 */

import { Controller, Get } from '@overnightjs/core';
import { Logger } from '@overnightjs/logger';
import { Request, Response } from 'express';
import { OK } from 'http-status-codes';


@Controller('grandchild-3')
export class GrandChild3Controller {


    @Get()
    private get(req: Request, res: Response) {
        const message = 'Hi I\'m the grandchild 3 controller';
        Logger.Info(message);
        return res.status(OK).json({message});
    }
}

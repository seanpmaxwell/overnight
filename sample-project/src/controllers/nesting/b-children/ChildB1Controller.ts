/**
 * ChildB1Controller
 *
 * created by Sean Maxwell May 26, 2019
 */

import { Controller, Get } from '@overnightjs/core';
import { Logger } from '@overnightjs/logger';
import { Request, Response } from 'express';


@Controller('child-b1')
export class ChildB1Controller {


    @Get()
    private get(req: Request, res: Response) {
        const message = 'Hi I\'m the child B1 controller';
        Logger.Info(message);
        return res.status(200).json({message});
    }
}

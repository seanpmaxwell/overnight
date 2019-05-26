/**
 * ChildA1Controller
 *
 * created by Sean Maxwell May 25, 2019
 */

import { Controller, Get } from '@overnightjs/core';
import { Logger } from '@overnightjs/logger';
import { Request, Response } from 'express';


@Controller('child-a1')
export class ChildA1Controller {


    @Get()
    private get(req: Request, res: Response) {
        const message = 'Hi I\'m the child A1 controller';
        Logger.Info(message);
        return res.status(200).json({message});
    }
}

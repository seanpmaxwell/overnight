/**
 * GrandChild1Controller
 *
 * created by Sean Maxwell May 26, 2019
 */

import { Controller, Get } from '@overnightjs/core';
import { Logger } from '@overnightjs/logger';
import { Request, Response } from 'express';


@Controller('grandchild-1')
export class GrandChild1Controller {


    @Get()
    private get(req: Request, res: Response) {
        const message = 'Hi I\'m the grandchild 1 controller';
        Logger.Info(message);
        return res.status(200).json({message});
    }
}

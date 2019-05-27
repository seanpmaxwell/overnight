/**
 * GrandChild2Controller
 *
 * created by Sean Maxwell May 26, 2019
 */

import { Controller, Get } from '@overnightjs/core';
import { Logger } from '@overnightjs/logger';
import { Request, Response } from 'express';


@Controller('grandchild-2')
export class GrandChild2Controller {


    @Get()
    private get(req: Request, res: Response) {
        const message = 'Hi I\'m the grandchild 2 controller';
        Logger.Info(message);
        return res.status(200).json({message});
    }
}

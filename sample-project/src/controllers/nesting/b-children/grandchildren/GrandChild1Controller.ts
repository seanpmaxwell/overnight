/**
 * GrandChild1Controller
 *
 * created by Sean Maxwell May 26, 2019
 */

import {ClassOptions, Controller, Get} from '@overnightjs/core';
import {Logger} from '@overnightjs/logger';
import {Request, Response} from 'express';


@Controller('grandchild-1')
@ClassOptions({mergeParams: true})
export class GrandChild1Controller {


    @Get(':dude')
    private get(req: Request, res: Response) {
        const message = 'Hi I\'m the grandchild 1 controller';
        Logger.Info(message);
        Logger.Info(req.params, true);
        return res.status(200).json({message});
    }
}

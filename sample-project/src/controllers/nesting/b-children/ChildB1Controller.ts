/**
 * ChildB1Controller
 *
 * created by Sean Maxwell May 26, 2019
 */

import { Controller, Get, ChildControllers, ClassOptions } from '@overnightjs/core';
import { Logger } from '@overnightjs/logger';
import { Request, Response } from 'express';
import { OK } from 'http-status-codes';
import { GrandChild1Controller } from './grandchildren/GrandChild1Controller';
import { GrandChild2Controller } from './grandchildren/GrandChild2Controller';
import { GrandChild3Controller } from './grandchildren/GrandChild3Controller';


@Controller('child-b1/:name')
@ClassOptions({mergeParams: true})
@ChildControllers([
    new GrandChild1Controller(),
    new GrandChild2Controller(),
    new GrandChild3Controller(),
])
export class ChildB1Controller {


    @Get()
    private get(req: Request, res: Response) {
        const message = 'Hi I\'m the child B1 controller';
        Logger.Info(message);
        Logger.Info(req.params, true);
        return res.status(OK).json({message});
    }
}

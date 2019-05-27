/**
 * ChildB1Controller
 *
 * created by Sean Maxwell May 26, 2019
 */

import {Controller, Get, Children, ClassOptions} from '@overnightjs/core';
import {Logger} from '@overnightjs/logger';
import {Request, Response} from 'express';
import {GrandChild1Controller} from './grandchildren/GrandChild1Controller';
import {GrandChild2Controller} from './grandchildren/GrandChild2Controller';
import {GrandChild3Controller} from './grandchildren/GrandChild3Controller';


@Controller('child-b1/:name')
@ClassOptions({mergeParams: true})
@Children([
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
        return res.status(200).json({message});
    }
}

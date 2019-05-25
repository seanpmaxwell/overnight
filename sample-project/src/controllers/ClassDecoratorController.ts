/**
 * Class to test middleware being passed at the class level.
 *
 * created by Sean Maxwell, 5/23/2019
 */

import { Controller, ClassMiddleware, Get, Post, Middleware } from '@overnightjs/core';
import { Logger } from '@overnightjs/logger';
import { Request, Response } from 'express';
import { sayHello, sayGoodbye } from './other/CustomMiddleware';


@Controller('api/say-hello')
@ClassMiddleware(sayHello)
export class ClassDecoratorController {


    @Get()
    private get(req: Request, res: Response): any {
        Logger.Info('get called');
        return res.status(200).json({msg: 'get_called'});
    }


    @Post()
    @Middleware(sayGoodbye)
    private post(req: Request, res: Response): any {
        Logger.Info('post called');
        return res.status(200).json({msg: 'post_called'});
    }
}

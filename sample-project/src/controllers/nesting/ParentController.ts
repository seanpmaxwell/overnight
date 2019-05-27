/**
 * Controller for developing nested Controllers.
 *
 * created by Sean Maxwell May 25, 2019
 */

import { OK } from 'http-status-codes';
import { Request, Response } from 'express';
import { Controller, Children, Get } from '@overnightjs/core';
import { Logger } from '@overnightjs/logger';
import { ChildA1Controller } from './a-children/ChildA1Controller';
import { ChildA2Controller } from './a-children/ChildA2Controller';
import { ChildB1Controller } from './b-children/ChildB1Controller';



@Controller('parent')
@Children([
    new ChildA1Controller(),
    new ChildA2Controller(),
    new ChildB1Controller(),
])
export class ParentController {


    @Get()
    private get(req: Request, res: Response) {
        const message = 'Hi I\'m the parent controller';
        Logger.Info(message);
        return res.status(OK).json({message});
    }
}

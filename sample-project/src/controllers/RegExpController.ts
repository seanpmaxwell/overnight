/**
 * Class to test regular expressions at the controller.
 *
 * created by Joey Kilpatrick, 2/5/2020
 */

import { Controller, Get } from '@overnightjs/core';
import { Request, Response } from 'express';
import {OK} from 'http-status-codes';

@Controller('regex')
export class RegExpController {


    @Get()
    public getRoot(req: Request, res: Response): any {
        return res.status(OK).json({
            message: '',
        });
    }


    @Get(/ane/) // Matches /lane, /cane, etc.
    public getAne(req: Request, res: Response): any {
        return res.status(OK).json({
            message: '/ane/',
        });
    }


    @Get(/^rain$/) // Matches /rain, but not /brain
    public get(req: Request, res: Response): any {
        return res.status(OK).json({
            message: '/^rain$/',
        });
    }

}

/**
 * Class to test regular expression routes in a controller's methods.
 *
 * created by Joey Kilpatrick, 2/6/2020
 */

import { Request, Response } from 'express';
import {OK} from 'http-status-codes';

import {assertRequest} from '../helpers';
import { Controller, Get } from '../../../lib';
import {HttpVerb} from '../../../lib/decorators/types';

@Controller('regex')
export class RegExpController {


    @Get()
    public getRoot(req: Request, res: Response): any {
        return res.status(OK).json({
            message: '',
        });
    }


    @Get(/ane/)
    public getAne(req: Request, res: Response): any {
        return res.status(OK).json({
            message: '/ane/',
        });
    }


    @Get(/^rain$/)
    public getRain(req: Request, res: Response): any {
        return res.status(OK).json({
            message: '/^rain$/',
        });
    }


    @Get('brain')
    public getBrain(req: Request, res: Response): any {
        return res.status(OK).json({
            message: 'brain',
        });
    }


    public static async validateAll(): Promise<void> {
        await assertRequest('/regex', HttpVerb.GET, {
            body: {
                message: '',
            },
            status: OK,
        });
        await assertRequest('/regex/ane', HttpVerb.GET, {
            body: {
                message: '/ane/',
            },
            status: OK,
        });
        await assertRequest('/regex///ane', HttpVerb.GET, {
            body: {
                message: '/ane/',
            },
            status: OK,
        });
        await assertRequest('/regex/candycane', HttpVerb.GET, {
            body: {
                message: '/ane/',
            },
            status: OK,
        });
        await assertRequest('/regex/lanes', HttpVerb.GET, {
            body: {
                message: '/ane/',
            },
            status: OK,
        });
        await assertRequest('/regex/down/the/lane/and/up/the/street', HttpVerb.GET, {
            body: {
                message: '/ane/',
            },
            status: OK,
        });
        await assertRequest('/regex/rain', HttpVerb.GET, {
            body: {
                message: '/^rain$/',
            },
            status: OK,
        });
        await assertRequest('/regex/brain', HttpVerb.GET, {
            body: {
                message: 'brain',
            },
            status: OK,
        });
    }

}

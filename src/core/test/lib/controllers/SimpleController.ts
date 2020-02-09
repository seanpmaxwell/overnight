/**
 * Class to test a simple controller.
 *
 * created by Joey Kilpatrick, 2/6/2020
 */

import {Request, RequestHandler, Response} from 'express';
import {OK} from 'http-status-codes';

import {assertRequest} from '../helpers';
import {Controller, Get, Post} from '../../../lib';
import {HttpVerb} from '../../../lib/decorators/types';

@Controller('simple')
export class SimpleController {


    @Get()
    public get(req: Request, res: Response): any {
        return res.status(OK).json({
            message: '',
        });
    }


    @Get('path1')
    public path1(req: Request, res: Response): any {
        return res.status(OK).json({
            message: 'path1',
        });
    }


    @Get('path2')
    public path2Get(req: Request, res: Response): any {
        return res.status(OK).json({
            message: 'path2',
        });
    }


    @Post('path2')
    public path2Post(req: Request, res: Response): any {
        return res.status(OK).json({
            message: 'path2',
        });
    }


    @Get('path3')
    public path3: RequestHandler = (req: Request, res: Response): any => {
        return res.status(OK).json({message: 'path3'});
    }


    public static async validateAll(): Promise<void> {
        await assertRequest('/simple', HttpVerb.GET, {
            body: {
                message: '',
            },
            status: OK,
        });
        await assertRequest('/simple/path1', HttpVerb.GET, {
            body: {
                message: 'path1',
            },
            status: OK,
        });
        await assertRequest('/simple/path2', HttpVerb.GET, {
            body: {
                message: 'path2',
            },
            status: OK,
        });
        await assertRequest('/simple/path2', HttpVerb.POST, {
            body: {
                message: 'path2',
            },
            status: OK,
        });
        await assertRequest('/simple/path3', HttpVerb.GET, {
            body: {
                message: 'path3',
            },
            status: OK,
        });
    }


    public static async validateWrapperOnProperty(): Promise<void> {
        await assertRequest('/simple/path3', HttpVerb.GET, {
            body: {
                message: 'path3',
            },
            status: OK,
        });
    }

}


/**
 * Classes to test @ClassOptions on controllers.
 *
 * created by Joey Kilpatrick, 2/8/2020
 */

import {Request, Response} from 'express';
import {OK} from 'http-status-codes';

import {assertRequest} from '../helpers';
import {ClassOptions, Controller, Get} from '../../../lib';
import {HttpVerb} from '../../../lib/decorators/types';

@Controller('caseSensitiveController')
@ClassOptions({caseSensitive: true})
export class CaseSensitiveController {


    @Get('path1')
    public get(req: Request, res: Response): Response {
        return res.status(OK).json({
            message: 'path1',
        });
    }


    @Get('Path1')
    public path1(req: Request, res: Response): Response {
        return res.status(OK).json({
            message: 'Path1',
        });
    }


    public static async validateAll(): Promise<void> {
        await assertRequest('/caseSensitiveController/path1', HttpVerb.GET, {
            body: {
                message: 'path1',
            },
            status: OK,
        });
        await assertRequest('/caseSensitiveController/Path1', HttpVerb.GET, {
            body: {
                message: 'Path1',
            },
            status: OK,
        });
    }
}

// tslint:disable-next-line:max-classes-per-file
@ClassOptions({caseSensitive: false})
@Controller('caseInsensitiveController')
export class CaseInsensitiveController {


    @Get('path1')
    public get(req: Request, res: Response): Response {
        return res.status(OK).json({
            message: 'path1',
        });
    }


    @Get('Path1')
    public path1(req: Request, res: Response): Response {
        return res.status(OK).json({
            message: 'Path1',
        });
    }


    public static async validateAll(): Promise<void> {
        await assertRequest('/caseInsensitiveController/path1', HttpVerb.GET, {
            body: {
                message: 'path1',
            },
            status: OK,
        });
        await assertRequest('/caseInsensitiveController/Path1', HttpVerb.GET, {
            body: {
                message: 'path1',
            },
            status: OK,
        });
    }
}


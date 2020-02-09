/**
 * Class to test @Wrapper on a controller's methods.
 *
 * created by Joey Kilpatrick, 2/8/2020
 */

import {Request, RequestHandler, Response} from 'express';
import {OK} from 'http-status-codes';

import {assertRequest} from '../helpers';
import {Controller, Get, Wrapper} from '../../../lib';
import {HttpVerb} from '../../../lib/decorators/types';

@Controller('wrapper')
export class MethodWrapperController {


    @Get('path1')
    // Transparent wrapper
    @Wrapper((handler: RequestHandler) => {
        return handler;
    })
    private path1(_: Request, res: Response): Response {
        return res.status(OK).json({
            message: 'path1',
        });
    }


    public static async validateTransparentWrapper(): Promise<void> {
        await assertRequest('/wrapper/path1', HttpVerb.GET, {
            body: {
                message: 'path1',
            },
            status: OK,
        });
    }


    @Get('path2')
    // Overriding wrapper
    @Wrapper((_) => {
        return MethodWrapperController.path2Actual;
    })
    private path2Ignored(_: Request, res: Response): Response {
        return res.status(OK).json({
            message: 'path2 ignored',
        });
    }


    private static path2Actual(_: Request, res: Response): Response {
        return res.status(OK).json({
            message: 'path2 actual',
        });
    }


    public static async validateOverridingWrapper(): Promise<void> {
        await assertRequest('/wrapper/path2', HttpVerb.GET, {
            body: {
                message: 'path2 actual',
            },
            status: OK,
        });
    }


    @Get('path3')
    // Re-typing wrapper
    @Wrapper((method: (num: number) => number): RequestHandler => {
        return (req: Request, res: Response): Response => {
            return res.status(OK).json({
                message: method(1),
            });
        };
    })
    private path3(num: number): number {
        return num + 1;
    }


    public static async validateRetypingWrapper(): Promise<void> {
        await assertRequest('/wrapper/path3', HttpVerb.GET, {
            body: {
                message: 2,
            },
            status: OK,
        });
    }


    @Get('path4')
    @Wrapper((handler: RequestHandler) => {
        return handler;
    })
    private path4: RequestHandler = (req: Request, res: Response): Response => {
        return res.status(OK).json({
            message: 'path4',
        });
    }


    public static async validateWrapperOnProperty(): Promise<void> {
        await assertRequest('/wrapper/path4', HttpVerb.GET, {
            body: {
                message: 'path4',
            },
            status: OK,
        });
    }
}


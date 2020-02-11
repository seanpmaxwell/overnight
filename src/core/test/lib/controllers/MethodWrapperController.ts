/**
 * Class to test @Wrapper on a controller's methods.
 *
 * created by Joey Kilpatrick, 2/8/2020
 */

import {Request, RequestHandler, Response} from 'express';
import {OK} from 'http-status-codes';

import {assertRequest} from '../helpers';
import {Controller, Get, Wrapper} from '../../../lib';
import {HttpVerb, WrapperFunction} from '../../../lib/decorators/types';

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
    @Wrapper((_: any) => {
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


    @Wrapper((handler: RequestHandler) => {
        return handler;
    })
    @Get('path4')
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


    @Get('path5')
    @Wrapper(MethodWrapperController.returnAsMessage(1, 1, 1, 1))
    private path5(num1: number, num2: number, num3: number, num4: number): number {
        return num1 + num2 + num3 + num4;
    }


    private static returnAsMessage(...args: any): WrapperFunction {
        return (method: Function): RequestHandler => {
            return (req: Request, res: Response): Response => {
                return res.status(200).json({
                    message: method(...args) + ' arguments',
                });
            };
        };
    }


    public static async validateWrapperOnMethodWithMoreThan3Parameters(): Promise<void> {
        await assertRequest('/wrapper/path5', HttpVerb.GET, {
            body: {
                message: '4 arguments',
            },
            status: OK,
        });
    }
}


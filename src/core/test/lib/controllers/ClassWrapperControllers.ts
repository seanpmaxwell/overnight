/**
 * Classes to test @ClassWrapper on controllers.
 *
 * created by Joey Kilpatrick, 2/8/2020
 */

import {Request, RequestHandler, Response} from 'express';
import {OK} from 'http-status-codes';

import {assertRequest} from '../helpers';
import {ClassWrapper, Controller, Get} from '../../../lib';
import {HttpVerb} from '../../../lib/decorators/types';

@Controller('transparentClassWrapper')
@ClassWrapper((handler: RequestHandler) => {
    return handler;
})
export class TransparentClassWrapperController {


    @Get('path1')
    private path1(_: Request, res: Response): Response {
        return res.status(OK).json({
            message: 'path1',
        });
    }


    public static async validateTransparentClassWrapper(): Promise<void> {
        await assertRequest('/transparentClassWrapper/path1', HttpVerb.GET, {
            body: {
                message: 'path1',
            },
            status: OK,
        });
    }
}

// tslint:disable-next-line:max-classes-per-file
@Controller('overridingClassWrapper')
@ClassWrapper((_: any) => {
    return OverridingClassWrapperController.path1Actual;
})
export class OverridingClassWrapperController {


    @Get('path1')
    private path1Ignored(_: Request, res: Response): Response {
        return res.status(OK).json({
            message: 'path1 ignored',
        });
    }


    private static path1Actual(_: Request, res: Response): Response {
        return res.status(OK).json({
            message: 'path1 actual',
        });
    }


    public static async validateOverridingClassWrapper(): Promise<void> {
        await assertRequest('/overridingClassWrapper/path1', HttpVerb.GET, {
            body: {
                message: 'path1 actual',
            },
            status: OK,
        });
    }
}

// tslint:disable-next-line:max-classes-per-file
@Controller('retypingClassWrapper')
@ClassWrapper((method: (num: number) => number): RequestHandler => {
    return (req: Request, res: Response): Response => {
        return res.status(OK).json({
            message: method(1),
        });
    };
})
export class RetypingClassWrapperController {


    @Get('path1')
    private path1(num: number): number {
        return num + 1;
    }


    public static async validateRetypingClassWrapper(): Promise<void> {
        await assertRequest('/retypingClassWrapper/path1', HttpVerb.GET, {
            body: {
                message: 2,
            },
            status: OK,
        });
    }
}

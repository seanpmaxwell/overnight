/**
 * Classes to test @ClassMiddleware on controllers.
 *
 * created by Joey Kilpatrick, 2/8/2020
 */

import {NextFunction, Request, Response} from 'express';
import {OK} from 'http-status-codes';

import {assertRequest} from '../helpers';
import {ClassMiddleware, Controller, Get} from '../../../lib';
import {HttpVerb} from '../../../lib/decorators/types';

let middlewares: string[] = [];

function middleware0(_req: Request, _res: Response, next: NextFunction): void {
    middlewares = ['middleware0'];
    next();
}


function middleware1(_req: Request, _res: Response, next: NextFunction): void {
    middlewares.push('middleware1');
    next();
}


function middleware2(_req: Request, _res: Response, next: NextFunction): void {
    middlewares.push('middleware2');
    next();
}

@Controller('singleClassMiddleware')
@ClassMiddleware(middleware0)
export class SingleClassMiddlewareController {


    @Get('path1')
    private path1(_: Request, res: Response): Response {
        return res.status(OK).json({
            message: 'path1',
            middlewares,
        });
    }


    public static async validateAddSingleClassMiddleware(): Promise<void> {
        await assertRequest('/singleClassMiddleware/path1', HttpVerb.GET, {
            body: {
                message: 'path1',
                middlewares: ['middleware0'],
            },
            status: OK,
        });
    }
}

// tslint:disable-next-line:max-classes-per-file
@Controller('arrayOfSingleClassMiddleware')
@ClassMiddleware([middleware0])
export class ArrayOfSingleClassMiddlewareController {


    @Get('path1')
    private path1(_: Request, res: Response): Response {
        return res.status(OK).json({
            message: 'path1',
            middlewares,
        });
    }


    public static async validateAddArrayOfSingleClassMiddleware(): Promise<void> {
        await assertRequest('/arrayOfSingleClassMiddleware/path1', HttpVerb.GET, {
            body: {
                message: 'path1',
                middlewares: ['middleware0'],
            },
            status: OK,
        });
    }
}

// tslint:disable-next-line:max-classes-per-file
@Controller('arrayOfClassMiddleware')
@ClassMiddleware([
    middleware0,
    middleware1,
    middleware2,
])
export class ArrayOfClassMiddlewareController {


    @Get('path1')
    private path1(_: Request, res: Response): Response {
        return res.status(OK).json({
            message: 'path1',
            middlewares,
        });
    }


    public static async validateAddArrayOfClassMiddleware(): Promise<void> {
        await assertRequest('/arrayOfClassMiddleware/path1', HttpVerb.GET, {
            body: {
                message: 'path1',
                middlewares: [
                    'middleware0',
                    'middleware1',
                    'middleware2',
                ],
            },
            status: OK,
        });
    }
}

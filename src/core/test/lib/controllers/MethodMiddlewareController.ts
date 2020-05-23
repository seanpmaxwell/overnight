/**
 * Class to test @Middleware on a controller's methods.
 *
 * created by Joey Kilpatrick, 2/8/2020
 */

import {NextFunction, Request, RequestHandler, Response} from 'express';
import {OK} from 'http-status-codes';

import {assertRequest} from '../helpers';
import {Controller, Get, Middleware} from '../../../lib';
import {HttpVerb} from '../../../lib/decorators/types';

@Controller('middleware')
export class MethodMiddlewareController {

    private static middlewares: string[] = [];


    private static middleware0(_req: Request, _res: Response, next: NextFunction): void {
        MethodMiddlewareController.middlewares = ['middleware0'];
        next();
    }


    private static middleware1(_req: Request, _res: Response, next: NextFunction): void {
        MethodMiddlewareController.middlewares.push('middleware1');
        next();
    }


    private static middleware2(_req: Request, _res: Response, next: NextFunction): void {
        MethodMiddlewareController.middlewares.push('middleware2');
        next();
    }


    @Get('path1')
    @Middleware(MethodMiddlewareController.middleware0)
    private path1(_: Request, res: Response): Response {
        return res.status(OK).json({
            message: 'path1',
            middlewares: MethodMiddlewareController.middlewares,
        });
    }


    public static async validateAddSingleMiddleware(): Promise<void> {
        await assertRequest('/middleware/path1', HttpVerb.GET, {
            body: {
                message: 'path1',
                middlewares: ['middleware0'],
            },
            status: OK,
        });
    }


    @Get('path2')
    @Middleware([MethodMiddlewareController.middleware0])
    private path2(_: Request, res: Response): Response {
        return res.status(OK).json({
            message: 'path2',
            middlewares: MethodMiddlewareController.middlewares,
        });
    }


    public static async validateAddArrayOfMiddlewareOfLength1(): Promise<void> {
        await assertRequest('/middleware/path2', HttpVerb.GET, {
            body: {
                message: 'path2',
                middlewares: ['middleware0'],
            },
            status: OK,
        });
    }


    @Get('path3')
    @Middleware([
        MethodMiddlewareController.middleware0,
        MethodMiddlewareController.middleware1,
        MethodMiddlewareController.middleware2,
    ])
    private path3(_: Request, res: Response): Response {
        return res.status(OK).json({
            message: 'path3',
            middlewares: MethodMiddlewareController.middlewares,
        });
    }


    public static async validateAddArrayOfMiddleware(): Promise<void> {
        await assertRequest('/middleware/path3', HttpVerb.GET, {
            body: {
                message: 'path3',
                middlewares: [
                    'middleware0',
                    'middleware1',
                    'middleware2',
                ],
            },
            status: OK,
        });
    }


    @Get('path4')
    @Middleware(MethodMiddlewareController.middleware0)
    private path4: RequestHandler = (_: Request, res: Response): Response => {
        return res.status(OK).json({
            message: 'path4',
            middlewares: MethodMiddlewareController.middlewares,
        });
    }


    public static async validateMiddlewareOnProperty(): Promise<void> {
        await assertRequest('/middleware/path4', HttpVerb.GET, {
            body: {
                message: 'path4',
                middlewares: ['middleware0'],
            },
            status: OK,
        });
    }


    @Get('path5')
    @Middleware(MethodMiddlewareController.middleware0)
    @Middleware(MethodMiddlewareController.middleware1)
    @Middleware(MethodMiddlewareController.middleware2)
    private path5(_: Request, res: Response): Response {
        return res.status(OK).json({
            message: 'path5',
            middlewares: MethodMiddlewareController.middlewares,
        });
    }


    public static async validateMultipleMiddlewareDecorators(): Promise<void> {
        await assertRequest('/middleware/path5', HttpVerb.GET, {
            body: {
                message: 'path5',
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


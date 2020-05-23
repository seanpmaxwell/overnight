/**
 * Classes to test @ClassErrorMiddleware on controllers.
 *
 * created by Joey Kilpatrick, 2/8/2020
 */

import {NextFunction, Request, Response} from 'express';
import {OK} from 'http-status-codes';

import {assertRequest} from '../helpers';
import {ClassErrorMiddleware, Controller, Get} from '../../../lib';
import {HttpVerb} from '../../../lib/decorators/types';

let errorMiddlewares: string[] = [];

function errorMiddleware0(err: Error, _req: Request, res: Response, _next: NextFunction): any {
    errorMiddlewares.push('errorMiddleware0');
    res.status(OK).json({
        errorMiddlewares,
    });
    errorMiddlewares = [];
}


function errorMiddleware1(err: Error, _req: Request, _res: Response, _next: NextFunction): any {
    errorMiddlewares.push('errorMiddleware1');
    throw Error();
}


function errorMiddleware2(err: Error, _req: Request, _res: Response, _next: NextFunction): any {
    errorMiddlewares.push('errorMiddleware2');
    throw Error();
}

@Controller('singleClassErrorMiddleware')
@ClassErrorMiddleware(errorMiddleware0)
export class SingleClassErrorMiddlewareController {


    @Get('path1')
    private path1(_req: Request, _res: Response): Response {
        throw Error();
    }


    public static async validateAddSingleErrorMiddleware(): Promise<void> {
        await assertRequest('/singleClassErrorMiddleware/path1', HttpVerb.GET, {
            body: {
                errorMiddlewares: ['errorMiddleware0'],
            },
            status: OK,
        });
    }
}

// tslint:disable-next-line:max-classes-per-file
@Controller('arrayOfSingleClassErrorMiddleware')
@ClassErrorMiddleware([errorMiddleware0])
export class ArrayOfSingleClassErrorMiddlewareController {


    @Get('path1')
    private path1(_req: Request, _res: Response): Response {
        throw Error();
    }


    public static async validateAddArrayOfClassErrorMiddlewareOfLength1(): Promise<void> {
        await assertRequest('/arrayOfSingleClassErrorMiddleware/path1', HttpVerb.GET, {
            body: {
                errorMiddlewares: ['errorMiddleware0'],
            },
            status: OK,
        });
    }
}

// tslint:disable-next-line:max-classes-per-file
@Controller('arrayOfClassErrorMiddleware')
@ClassErrorMiddleware([
    errorMiddleware2,
    errorMiddleware1,
    errorMiddleware0,
])
export class ArrayOfClassErrorMiddlewareController {


    @Get('path1')
    private path1(_req: Request, _res: Response): Response {
        throw Error();
    }


    public static async validateAddArrayOfClassErrorMiddleware(): Promise<void> {
        await assertRequest('/arrayOfClassErrorMiddleware/path1', HttpVerb.GET, {
            body: {
                errorMiddlewares: ['errorMiddleware2', 'errorMiddleware1', 'errorMiddleware0'],
            },
            status: OK,
        });
    }
}

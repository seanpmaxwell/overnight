/**
 * Class to test if controllers and
 * controller methods are correctly matched
 * regardless if they have a forward slash or not.
 */
import { Request, Response } from 'express';
import { OK } from 'http-status-codes';

import { assertRequest } from '../helpers';
import { Get, Post, Controller } from '../../../lib';
import { HttpVerb } from '../../../lib/decorators/types';

@Controller('/path')
export class PathMatchingController {


    @Get('/forward-slash')
    public get(req: Request, res: Response): any {
        return res.status(OK).json({
            message: 'forwardSlash',
        });
    }


    @Post('/forward-slash')
    public post(req: Request, res: Response): any {
        return res.status(OK).json({
            message: 'forwardSlash',
        });
    }


    @Get('no-forward-slash')
    public noForwardSlash(req: Request, res: Response): any {
        return res.status(OK).json({
            message: 'forwardSlash',
        });
    }


    public static async validateAll(): Promise<void> {
        type ExecuteRequest = (verb: HttpVerb, path: string) => Promise<void>;
        const request: ExecuteRequest = (verb: HttpVerb, path: string): Promise<void> => (
          assertRequest(path, verb, {
            body: { message: 'forwardSlash' },
            status: OK,
          }
        ));

        await Promise.all([
          request(HttpVerb.GET, '/path/forward-slash'),
          request(HttpVerb.POST, '/path/forward-slash'),
          request(HttpVerb.GET, '/path/no-forward-slash')
        ]);
    }

}


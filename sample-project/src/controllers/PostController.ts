/**
 * Example handling asynchronous calls for the OvernightJS
 * library with custom router object. This example is setup
 * for the express-promise-router library.
 *
 * created by Sean Maxwell Aug 28, 2018
 */

import { Request, Response }    from 'express';
import { Controller, Get, Put } from '@overnightjs/core';
import { ParentController }     from './ParentController';


@Controller('api/posts')
export class PostController extends ParentController {

    @Get(':id')
    private get(req: Request, res: Response): Promise<Response> {
        return this.someAsyncFunction(req.params.id)
                    .then(ret => res.status(200).json({msg: ret}));
    }

    private someAsyncFunction(id: number): Promise<string> {

        return new Promise((resolve, reject) => {

            if (isNaN(id)) {
                reject('You entered an invalid post id: ' + id);
            } else {
                resolve('You entered the post id: ' + id);
            }
        })
    }

    @Put(':id')
    private add(req: Request, res: Response): Promise<string> {
        return Promise.resolve('next');
    }

    @Put('foo')
    private add2(req: Request, res: Response): void {
        res.status(200).json({msg: 'Route used: ' + req.url});
    }
}

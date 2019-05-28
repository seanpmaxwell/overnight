/**
 * Example Controller for the Overnight web-framework.
 *
 * created by Sean Maxwell Aug 26, 2018
 */

import { OK, BAD_REQUEST } from 'http-status-codes';
import { Controller, Get, Wrapper } from '@overnightjs/core';
import { asyncWrapper } from './other/wrapperFunctions';
import { Request, Response } from 'express';
import { Logger } from '@overnightjs/logger';


@Controller('wrapper')
export class WrapperPracticeController {


    @Get("async/:id")
    @Wrapper(asyncWrapper)
    private async asyncGet(req: Request, res: Response) {
        res.json({ user: req.params.id });
    }


    @Get("async/:id")
    @Wrapper(asyncWrapper)
    private async genericGet(req: Request, res: Response) {
        try {
            if (req.params.id === 'make_it_fail') {
                throw Error('Method failed on purpose');
            }
            res.status(OK).json({
                user: req.params.id,
            });
        } catch (err) {
            Logger.Err(err, true);
            res.status(BAD_REQUEST).json({
                error: err.message,
            });
        }
    }


    // Pick up here, create an asynchronous function

}

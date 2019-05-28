/**
 * Example Controller for the Overnight web-framework.
 *
 * created by Sean Maxwell Aug 26, 2018
 */

import { OK, BAD_REQUEST } from 'http-status-codes';
import { Controller, Get, Wrapper } from '@overnightjs/core';
import { asyncWrapper, asyncFunction } from './other/wrapperFunctions';
import { Request, Response } from 'express';
import { Logger } from '@overnightjs/logger';


@Controller('wrapper-practice')
export class WrapperPracticeController {


    @Get('async-wrapper/:id')
    @Wrapper(asyncWrapper)
    private async asyncGet(req: Request, res: Response) {
        const asyncMsg = await asyncFunction(req.params.id === 'make_it_fail');
        return res.status(OK).json({
            message: asyncMsg,
        });
    }


    @Get('async/:id')
    private async genericGet(req: Request, res: Response) {
        try {
            const asyncMsg = await asyncFunction(req.params.id === 'make_it_fail');
            return res.status(OK).json({
                message: asyncMsg,
            });
        } catch (err) {
            Logger.Err(err, true);
            return res.status(BAD_REQUEST).json({
                error: err.message,
            });
        }
    }
}

/**
 * Example Controller for the Overnight web-framework.
 *
 * created by Sean Maxwell Aug 26, 2018
 */

import { OK, BAD_REQUEST } from 'http-status-codes';
import { Controller, Get, Wrapper } from '@overnightjs/core';
import { asyncWrapper } from './other/asyncWrapper';
import { Request, Response } from 'express';
import { Logger } from '@overnightjs/logger';


@Controller('wrapper')
export class WrapperPracticeController {


    @Get(":id")
    @Wrapper(asyncWrapper)
    async get(req: Request, res: Response) {
        res.json({ user: req.params.id });
    }
}

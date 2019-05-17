/**
 * Example Controller for the Overnight web-framework which
 * uses variable set to functions  .
 *
 * created by Sean Maxwell May 15, 2019
 */

import { Controller, Middleware, Get, Post, Put, Delete } from '@overnightjs/core';
import * as OvernightJS from '@overnightjs/core';
import { JwtManager, ISecureRequest } from '@overnightjs/jwt';
import { Request, Response } from 'express';
import { Logger } from '@overnightjs/logger';


@Controller('api/arrows')
export class ArrowFunctionController {

    private readonly logger: Logger;


    constructor() {
        this.logger = new Logger();
    }


    // @(OvernightJS as any).Post(':id')
    // private get: any = (req: Request, res: Response) => {
    //     this.logger.info(req.params.id);
    //     return res.status(200).json({msg: 'get_called'});
    // }


    @Get('')
    @Middleware(JwtManager.middleware)
    private getAll(req: ISecureRequest, res: Response): void {
        this.logger.info(req.payload, true);
        res.status(200).json({msg: 'get_all_called'});
    }


    @Post()
    private add(req: Request, res: Response): void {
        this.logger.info(req.body, true);
        res.status(200).json({msg: 'add_called'});
    }


    @Put('update-user')
    private update(req: Request, res: Response): void {
        this.logger.info(req.body);
        res.status(200).json({msg: 'update_called'});
    }


    @Delete('delete/:id')
    private delete(req: Request, res: Response): void {
        this.logger.info(req.params, true);
        res.status(200).json({msg: 'delete_called'});
    }
}

/**
 * Example Controller for the Overnight web-framework.
 *
 * created by Sean Maxwell Aug 26, 2018
 */

import { Controller, Middleware, Get, Post, Put, Delete } from '@overnightjs/core';
import { JwtManager, ISecureRequest } from '@overnightjs/jwt';
import { Request, Response } from 'express';
import { Logger } from '@overnightjs/logger';


@Controller('api/users')
export class UserController {

    private readonly logger: Logger;


    constructor() {
        this.logger = new Logger();
    }


    @Get(':id')
    private get(req: Request, res: Response): any {
        this.logger.info(req.params.id);
        return res.status(200).json({msg: 'get_called'});
    }


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


    @Get('practice/async')
    private async getWithAsync(req: Request, res: Response): Promise<void> {
        let msg;
        try {
            msg = await this.asyncMethod(req);
        } catch (err) {
            msg = err.message;
            this.logger.err(err, true);
        } finally {
            res.status(200).json({msg});
        }
    }


    private asyncMethod(req: Request): Promise<string> {
        return new Promise((resolve) => {
            resolve(req.originalUrl + ' called');
        });
    }
}

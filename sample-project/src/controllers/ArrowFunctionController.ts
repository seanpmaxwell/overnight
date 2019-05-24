/**
 * Example Controller for the Overnight web-framework which
 * uses variable set to functions  .
 *
 * created by Sean Maxwell May 15, 2019
 */

import * as OvernightJS from '@overnightjs/core';
import { JwtManager, ISecureRequest } from '@overnightjs/jwt';
import { Request, Response } from 'express';
import { Logger } from '@overnightjs/logger';


@(OvernightJS as any).Controller('api/arrows')
export class ArrowFunctionController {

    private readonly logger: Logger;


    constructor() {
        this.logger = new Logger();
    }


    @(OvernightJS as any).Get(':id')
    private get = (req: Request, res: Response) => {
        this.logger.info(req.params.id);
        return res.status(200).json({msg: 'get_called'});
    };


    @(OvernightJS as any).Get('jwt/:email')
    private getJwt(req: Request, res: Response): void {
        const jwtStr = JwtManager.jwt({
            email: req.params.email,
        });
        res.status(200).json({jwt: jwtStr});
    }


    @(OvernightJS as any).Get('')
    @(OvernightJS as any).Middleware(JwtManager.middleware)
    private getAll = (req: ISecureRequest, res: Response) => {
        this.logger.info(req.payload, true);
        res.status(200).json({msg: 'get_all_called'});
    };


    @(OvernightJS as any).Post()
    private add = (req: Request, res: Response) => {
        this.logger.info(req.body, true);
        res.status(200).json({msg: 'add_called'});
    };


    @(OvernightJS as any).Put('update-user')
    private update = (req: Request, res: Response) => {
        this.logger.info(req.body);
        res.status(200).json({msg: 'update_called'});
    };


    @(OvernightJS as any).Delete(':id')
    private delete = (req: Request, res: Response) => {
        this.logger.info(req.params, true);
        res.status(200).json({msg: 'delete_called'});
    }
}

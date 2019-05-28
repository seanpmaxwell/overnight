/**
 * Example Controller for the Overnight web-framework which
 * uses variable set to functions  .
 *
 * created by Sean Maxwell May 15, 2019
 */

import * as OvernightJS from '@overnightjs/core';
import { OK } from 'http-status-codes';
import { JwtManager, ISecureRequest } from '@overnightjs/jwt';
import { Request, Response } from 'express';
import { Logger } from '@overnightjs/logger';


@(OvernightJS as any).Controller('api/arrows')
export class ArrowFunctionController {


    @(OvernightJS as any).Get(':id')
    private get = (req: Request, res: Response) => {
        Logger.Info(req.params.id);
        return res.status(OK).json({
            message: 'get_called',
        });
    };


    @(OvernightJS as any).Get('jwt/:email')
    private getJwt(req: Request, res: Response) {
        const jwtStr = JwtManager.jwt({
            email: req.params.email,
        });
        return res.status(OK).json({
            jwt: jwtStr,
        });
    }


    @(OvernightJS as any).Get('')
    @(OvernightJS as any).Middleware(JwtManager.middleware)
    private getAll = (req: ISecureRequest, res: Response) => {
        Logger.Info(req.payload, true);
        return res.status(OK).json({
            message: 'get_all_called',
        });
    };


    @(OvernightJS as any).Post()
    private add = (req: Request, res: Response) => {
        Logger.Info(req.body, true);
        res.status(OK).json({
            message: 'add_called',
        });
    };


    @(OvernightJS as any).Put('update-user')
    private update = (req: Request, res: Response) => {
        Logger.Info(req.body);
        res.status(OK).json({
            message: 'update_called',
        });
    };


    @(OvernightJS as any).Delete(':id')
    private delete = (req: Request, res: Response) => {
        Logger.Info(req.params, true);
        res.status(OK).json({
            message: 'delete_called',
        });
    }
}

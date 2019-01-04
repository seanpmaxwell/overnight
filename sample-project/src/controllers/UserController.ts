/**
 * Example Controller for the Overnight web-framework.
 *
 * created by Sean Maxwell Aug 26, 2018
 */

import { Controller, Middleware, Get, Post, Put, Delete } from '@overnightjs/core';
import { jwtmiddleware, SecureRequest }                   from '@overnightjs/jwt';
import { Request, Response }                              from 'express';
import { cinfo, cerr }                                    from 'simple-color-print';
import { ParentController }                               from './ParentController';


@Controller('api/users')
export class UserController extends ParentController {

    @Get(':id')
    private get(req: Request, res: Response): any {
        cinfo(req.params.id);
        return res.status(200).json({msg: 'get_called'});
    }

    @Get('')
    @Middleware(jwtmiddleware)
    private getAll(req: SecureRequest, res: Response): void {
        cinfo(req.payload);
        res.status(200).json({msg: 'get_all_called'});
    }

    @Post()
    private add(req: Request, res: Response): void {
        cinfo(req.body);
        res.status(200).json({msg: 'add_called'});
    }

    @Put('update-user')
    private update(req: Request, res: Response): void {
        cinfo(req.body);
        res.status(200).json({msg: 'update_called'});
    }

    @Delete('delete/:id')
    private delete(req: Request, res: Response): void {
        cinfo(req.params);
        res.status(200).json({msg: 'delete_called'});
    }

    @Get('practice/async')
    private async getWithAsync(req: Request, res: Response): Promise<void> {
        let msg;

        try {
            msg = await this.asyncMethod(req);
        } catch (err) {
            cerr(err);
            msg = err;
        } finally {
            res.status(200).json({msg: msg});
        }
    }

    private asyncMethod(req: Request): Promise<string> {

        return new Promise(resolve => {
            resolve(req.originalUrl + ' called');
        })
    }
}

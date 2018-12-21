/**
 * Example Controller for the Overnight web-framework.
 *
 * created by Sean Maxwell Aug 26, 2018
 */

import { Controller, Middleware, Get } from '@overnightjs/core'
import { jwt, jwtmiddleware, JwtHandler, SecureRequest }  from '@overnightjs/jwt'

import { Request, Response } from 'express'
import { ParentController }  from './ParentController'

const jwtHandler = new JwtHandler('secret', '10h');
const JWTMIDDLEWARE = jwtHandler.getMiddleware();


@Controller('api/jwt')
export class JwtPracticeController extends ParentController
{
    @Get('getjwt/:email')
    private getJwt(req: Request, res: Response): void
    {
        let dataToEncypt = {
            email: req.params.email
        };

        res.status(200).json({jwt: jwt(dataToEncypt)});
    }

    @Get('callProtectedRoute')
    @Middleware(jwtmiddleware)
    private callProtectedRoute(req: SecureRequest, res: Response): void
    {
        res.status(200).json({email: req.payload.email});
    }

    @Get('getJwtFromHandler/:fullname')
    private getJwtFromHandler(req: Request, res: Response): void
    {
        let dataToEncypt = {
            fullName: req.params.fullname
        };

        res.status(200).json({jwt: jwtHandler.getJwt(dataToEncypt)});
    }

    @Get('callProtectedRouteFromHandler')
    @Middleware([JWTMIDDLEWARE])
    private callProtectedRouteFromHandler(req: SecureRequest, res: Response): void
    {
        res.status(200).json({fullname: req.payload.fullName});
    }
}

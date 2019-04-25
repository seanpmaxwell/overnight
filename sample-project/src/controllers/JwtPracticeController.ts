/**
 * Example Controller for the Overnight web-framework.
 *
 * created by Sean Maxwell Aug 26, 2018
 */

import { JwtManager, ISecureRequest } from "@overnightjs/jwt";
import { Controller, Middleware, Get, Post, Put } from "@overnightjs/core";
import { Request, Response } from "express";

const jwtMgr = new JwtManager("secret", "10h");


@Controller("api/jwt")
export class JwtPracticeController {


    @Get(":email")
    private getJwt(req: Request, res: Response): void {
        const jwtStr = JwtManager.jwt({
            email: req.params.email,
        });

        res.status(200).json({jwt: jwtStr});
    }


    @Post("callProtectedRoute")
    @Middleware(JwtManager.middleware)
    private callProtectedRoute(req: ISecureRequest, res: Response): void {
        res.status(200).json({email: req.payload.email});
    }


    @Put("getJwtAlt/:fullname")
    private getJwtFromHandler(req: Request, res: Response): void {
        const jwtStr = jwtMgr.jwt({
            fullName: req.params.fullname,
        });

        res.status(200).json({jwt: jwtStr});
    }


    @Post("callProtectedRouteAlt")
    @Middleware(jwtMgr.middleware)
    private callProtectedRouteFromHandler(req: ISecureRequest, res: Response): void {
        res.status(200).json({fullname: req.payload.fullName});
    }
}

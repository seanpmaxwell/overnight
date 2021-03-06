/**
 * Core file for the Overnight/Jwt library
 *
 * created by Sean Maxwell Dec 17, 2018
 */

import * as randomstring from 'randomstring';
import * as expressJwt from 'express-jwt';
import * as jsonwebtoken from 'jsonwebtoken';
import { RequestHandler } from 'express-jwt';
import { Request } from 'express';


// Export Secure Request to access the 'payload' property
export interface ISecureRequest extends Request {
    payload: any;
}

export class JwtManager {

    private static readonly SECRET = process.env.OVERNIGHT_JWT_SECRET || randomstring.generate(80);
    private static readonly EXP = process.env.OVERNIGHT_JWT_EXP || '3 days';

    private readonly secret: string;
    private readonly expires: string | number;


    constructor(secret: string, expires: string | number) {
        this.secret = secret;
        this.expires = expires;
    }


    /********************************************************************************
     *                              Get Jwt String
     *****************************************************************************/


    public static jwt(dataToEcrypt: string | Buffer | object): string {
        return JwtManager.setupJwt(dataToEcrypt, JwtManager.SECRET, JwtManager.EXP);
    }


    public jwt(dataToEcrypt: string | Buffer | object): string {
        return JwtManager.setupJwt(dataToEcrypt, this.secret, this.expires);
    }


    private static setupJwt(dataToEcrypt: string | Buffer | object, secret: string,
                            expires: string | number): string {
        const exp = {
            expiresIn: expires,
        };

        return jsonwebtoken.sign(dataToEcrypt, secret, exp);
    }



    /********************************************************************************
     *                            Get Middleware
     *******************************************************************************/


    public static get middleware(): RequestHandler {
        return JwtManager.setupMiddleware(JwtManager.SECRET);
    }


    public get middleware(): RequestHandler {
        return JwtManager.setupMiddleware(this.secret);
    }


    private static setupMiddleware(secret: string): RequestHandler {
        const options = {
            secret,
            userProperty: 'payload',
            algorithms: ['HS256']
        };

        return expressJwt(options);
    }
}

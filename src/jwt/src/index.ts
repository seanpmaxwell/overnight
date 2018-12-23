/**
 * Core file for the Overnight/Jwt library
 *
 * created by Sean Maxwell Dec 17, 2018
 */

import * as randomstring  from 'randomstring'
import * as expressJwt    from 'express-jwt'
import * as jsonwebtoken  from 'jsonwebtoken'
import { RequestHandler } from 'express-jwt'
import { Request }        from 'express'


// Pull in environment variables
const SECRET = process.env.OVERNIGHTJWTSECRET || randomstring.generate(80);
const EXP = process.env.OVERNIGHTJWTEXP || '3 days';



/***********************************************************************************************
 *                                          Middleware
 **********************************************************************************************/

function setupMiddlware(secret: string): RequestHandler
{
    let options = {
        secret: secret,
        userProperty: 'payload'
    };

    return expressJwt(options);
}

export let jwtmiddleware: RequestHandler = setupMiddlware(SECRET);




/***********************************************************************************************
 *                                          JWT
 **********************************************************************************************/

// expiresIn: expressed in seconds or a string describing a time span zeit/ms.
//     Eg: 60, "2 days", "10h", "7d". A numeric value is interpreted as a seconds count.
//     If you use a string be sure you provide the time units (days, hours, etc), otherwise
//     milliseconds unit is used by default ("120" is equal to "120ms").
function setupJwt(dataToEcrypt: string | Buffer | object, secret: string, expires: string | number): string
{
    let exp = {
        expiresIn: expires
    };

    return jsonwebtoken.sign(dataToEcrypt, secret, exp);
}

export function jwt(dataToEcrypt: string | Buffer | object): string
{
    return setupJwt(dataToEcrypt, SECRET, EXP);
}




/***********************************************************************************************
 *                                    Class for manual setup
 **********************************************************************************************/

export class JwtHandler
{
    private readonly _secret: string
    private readonly _expires: string | number

    constructor(secret: string, expires: string | number)
    {
        this._secret = secret;
        this._expires = expires;
    }

    getJwt(dataToEcrypt: string | Buffer | object): string
    {
        return setupJwt(dataToEcrypt, this._secret, this._expires);
    }

    getMiddleware(): RequestHandler
    {
        return setupMiddlware(this._secret);
    }
}




/***********************************************************************************************
 *                      SecureRequest provides the 'Payload' Property
 **********************************************************************************************/


// For routes passed with Jwt middleware
export interface SecureRequest extends Request 
{
    payload: any
}


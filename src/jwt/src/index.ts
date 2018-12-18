/**
 *
 *
 * created by Sean Maxwell Dec 17, 2018
 */

import * as expressJwt    from 'express-jwt'
import * as jsonwebtoken  from 'jsonwebtoken'
import { RequestHandler } from 'express-jwt'
import { Request }        from 'express'


// Pull in environment variables
const SECRET = process.env.OVERNIGHTJWTSECRET
const EXP = process.env.OVERNIGHTJWTEXP




/***********************************************************************************************
 *                                          Middleware
 **********************************************************************************************/

function setupMiddlware(secret: string): RequestHandler
{
    let opts = {
        secret: secret,
        userProperty: 'payload'
    }

    return expressJwt(opts) // pick up here
}

export let middleware: string = setupMiddlware(SECRET || '')




/***********************************************************************************************
 *                                          JWT
 **********************************************************************************************/

// expiresIn: expressed in seconds or a string describing a time span zeit/ms.
//     Eg: 60, "2 days", "10h", "7d". A numeric value is interpreted as a seconds count.
//     If you use a string be sure you provide the time units (days, hours, etc), otherwise
//     milliseconds unit is used by default ("120" is equal to "120ms").
function setupJwt(dataToEcrypt: any, secret: string, expirationTime: string | number): string
{
    let exp = {
        expiresIn: expirationTime
    }

    return jsonwebtoken.sign(dataToEcrypt, secret, exp)
}

export function jwt(dataToEcrypt: any)
{
    return setupJwt(dataToEcrypt, SECRET || '', EXP || '3 days')
}




/***********************************************************************************************
 *                                    Class for manual setup
 **********************************************************************************************/

export class jwtHandler
{
    getJwt(dataToEcrypt: any, secret: string, expirationTime: string | number): void
    {
        setupJwt(dataToEcrypt, secret, expirationTime)
    }

    getMiddleware(secret: string): void
    {
        return setupMiddlware(secret)
    }
}


// For routes pass with Jwt Middleware
// export interface SecureRequest extends Request {
//     payload: any
// }


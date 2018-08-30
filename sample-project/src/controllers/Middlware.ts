/**
 * Example Middleware for the Overnight web-framework.
 *
 * created by Sean Maxwell Aug 27, 2018
 */

import * as expressJwt    from 'express-jwt'
import { RequestHandler } from 'express-jwt'


export function getJwtMiddleware(): RequestHandler
{
    let opts = {
        secret: 'someRandomString',
        userProperty: 'payload'
    }

    return expressJwt(opts)
}
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
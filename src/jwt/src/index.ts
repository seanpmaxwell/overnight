/**
 *
 *
 * created by Sean Maxwell Dec 17, 2018
 */


// Pull in environment variables
const SECRET: string | undefined = process.env.OVERNIGHTJWTSECRET
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

function setupJwt(dataToEcrypt: any, secret: string, expirationTime: string)
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
    getJwt(dataToEcrypt: any, secret: string, expirationTime: string): void
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


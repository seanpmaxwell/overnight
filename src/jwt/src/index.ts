/**
 *
 *
 * created by Sean Maxwell Dec 17, 2018
 */


const JWT = process.env.OVERNIGHTJWTSECRET
const EXP = process.env.OVERNIGHTJWTEXP


/**
 *
 */
function setupMiddlware(): any
{
    let opts = {
        secret: 'someRandomString',
        userProperty: 'payload'
    }

    return expressJwt(opts) // pick up here
}

export var middleware: string = setupMiddlware()



/**
 *
 */
export function getJwt(info: {})
{

}



/**
 *
 */
export class jwtHandler
{
    getJwt(): void
    {

    }

    getMiddleware(): void
    {

    }
}


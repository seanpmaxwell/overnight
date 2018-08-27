/**
 * Examples for the Overnight web-framework.
 *
 * created by Sean Maxwell Aug 26, 2018
 */

import { oServer }     from '@overnight/core'
import { cinfo, cerr } from 'simple-color-print'

import UserController  from './UserController'
import MailPromise     from 'mail-promise'


export class Server extends oServer
{
    mailer: MailPromise

    constructor()
    {
        super()
        let userController = new UserController()
        super.addControllers([userController])
    }

    public start(port?: number)
    {
        port = port ? port : 3000
        cinfo('Server listening on port:' + port)
    }

}
/**
 * Examples for the Overnight web-framework.
 *
 * created by Sean Maxwell Aug 26, 2018
 */

const secrets = require('../secrets')

import * as bodyParser  from 'body-parser'
import { Server }       from '@overnight/core'
import { cinfo, cimp }  from 'simple-color-print'

import MailPromise      from 'mail-promise'
import UserController   from './UserController'
import SampleController from './SampleController'
import SignupController from './SignupController'


export class SampleServer extends Server
{
    constructor()
    {
        super()
        this.setupExpress()
        let ctrls = this.setupControllers()
        super.addControllers_(ctrls)
    }

    private setupExpress(): void
    {
        // Setup express here like you would
        // any other ExpressJS application.
        this.app_.use(bodyParser.json())
        this.app_.use(bodyParser.urlencoded({extended: true}))
    }

    private setupControllers(): Array<SampleController>
    {
        let mailer = new MailPromise(secrets.service, secrets.username,
            secrets.password)

        let userController = new UserController()
        let loginController = new SignupController()
        loginController.setMailer(mailer)

        return [userController, loginController]
    }

    public start(port?: number)
    {
        port = port ? port : 3000

        this.app_.get('/home', (req, res) => {
            res.send('hello overnight sample app')
        })

        this.app_.listen(port, () => {
            cimp('Server listening on port:' + port)
        })
    }
}

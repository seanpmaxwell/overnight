/**
 * Examples for the Overnight web-framework.
 *
 * created by Sean Maxwell Aug 26, 2018
 */

import * as bodyParser  from 'body-parser'
import { Server }       from '@overnight/core'
import { cinfo, cimp }  from 'simple-color-print'

import MailPromise      from 'mail-promise'
import UserController   from './UserController'
import SampleController from './SampleController'


export class SampleServer extends Server
{
    mailer: MailPromise

    constructor()
    {
        super()
        this.setupExpress()
        let ctrls = this.setupControllers()
        // super.addControllers(ctrls)
    }

    private setupExpress(): void
    {
        // To access req.body as JSON
        this.app_.use(bodyParser.json())
        this.app_.use(bodyParser.urlencoded({extended: true}))
    }

    private setupControllers()// : Array<SampleController>
    {
        let userController = new UserController()
        // userController.get(null, null)
        // return [userController]
        super.addControllers(userController)
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

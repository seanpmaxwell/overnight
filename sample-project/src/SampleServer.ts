/**
 * Examples for the Overnight web-framework.
 *
 * created by Sean Maxwell Aug 26, 2018
 */

import * as bodyParser  from 'body-parser'
import { Server }       from '@overnightjs/core'
import { cinfo, cimp }  from 'simple-color-print'

import MailPromise      from 'mail-promise'
import SampleController from './controllers/SampleController'
import * as controllers from './controllers/controllers'


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
        let mailer = new MailPromise('Gmail', process.env.EMAILUSER,
            process.env.EMAILPWD)

        let ctlrs = []
        for(let name in controllers) {
            let Controller = (<any>controllers)[name]
            let controller: SampleController = new Controller()

            controller.setMailer(mailer)
            ctlrs.push(controller)
        }

        return ctlrs
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

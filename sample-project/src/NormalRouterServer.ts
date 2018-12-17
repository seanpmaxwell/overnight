/**
 * Examples for the Overnight web-framework.
 *
 * created by Sean Maxwell Aug 26, 2018
 */

import * as bodyParser      from 'body-parser'
import * as controllers     from './controllers/controllers'
import * as daos            from './daos/daos'

import { Server }         from '@overnightjs/core'
import { cinfo, cimp }    from 'simple-color-print'
import { MailPromise }    from 'mail-promise'
import { DaoBase }        from './daos/DaoBase'
import { ControllerBase } from './controllers/ControllerBase'


export class NormalRouterServer extends Server
{
    constructor()
    {
        super()
        this.setupExpress()
        this.setupDaos()
        this.setupControllers()
    }

    private setupExpress(): void
    {
        // Setup express here like you would
        // any other ExpressJS application.
        this.app_.use(bodyParser.json())
        this.app_.use(bodyParser.urlencoded({extended: true}))
    }

    setupDaos(): void
    {
        // create a type for 'daos.ts' file
        type Daos = {
            [daoName: string]: typeof DaoBase
        }

        let daoInstances = []

        for(let daoName in daos)
        {
            if(daos.hasOwnProperty(daoName)) {
                let Dao = (<Daos>daos)[daoName]
                let dao = new Dao('pg-promise')
                daoInstances.push(dao)
            }
        }

        // Initialize Daos with OvernightJS
        super.addDaos_(daoInstances)
    }

    private setupControllers(): void
    {
        // Setup mailer object
        let user = process.env.EMAILUSER
        let pwd = process.env.EMAILPWD
        let mailer = new MailPromise('Gmail', user, pwd)

        // Create a type for the 'controllers.ts' file
        type Controllers = {
            [ctrlName: string]: typeof ControllerBase
        }

        let ctlrInstances = []

        for(let ctrlName in controllers)
        {
            if(controllers.hasOwnProperty(ctrlName)) {
                let Controller = (<Controllers>controllers)[ctrlName]
                let controller = new Controller()
                controller.setMailer(mailer)
                ctlrInstances.push(controller)
            }
        }

        // Initialize controllers with OvernightJS
        super.addControllers_('')
    }

    public start(port?: number)
    {
        port = port ? port : 3000

        this.app_.get('/home', (req, res) => {
            res.send('overnightjs with standard express router started')
        })

        this.app_.listen(port, () => {
            cimp('overnightjs with standard express router started on port:' + port)
        })
    }
}

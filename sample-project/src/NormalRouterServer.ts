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
import { Dao }            from './daos/Dao'
import { ControllerBase } from './controllers/ControllerBase'


export class NormalRouterServer extends Server
{
    constructor()
    {
        super()
        this.setupExpress()
        let daos = this.setupDaos()
        let controllers = this.setupControllers(daos)
        super.addControllers_(controllers)
    }

    private setupExpress(): void
    {
        // Setup express here like you would
        // any other ExpressJS application.
        this.app_.use(bodyParser.json())
        this.app_.use(bodyParser.urlencoded({extended: true}))
    }

    setupDaos(): Array<Dao>
    {
        // create a type for 'daos.ts' file
        type Daos = {
            [daoName: string]: typeof Dao
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

        return daoInstances
    }

    private setupControllers(daos: Array<Dao>): Array<ControllerBase>
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
                // controller Daos have to be set manually for there to be protected variable
                ctlrInstances.push(controller)
            }
        }

        return ctlrInstances
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

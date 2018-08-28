/**
 * Server super calls, for adding all controller routes to express server.
 *
 * created by Sean Maxwell Aug 26, 2018
 */

import * as express    from 'express'
import { cinfo, cerr } from 'simple-color-print'
import { Application, RequestHandler, Router} from 'express'

interface Controller {
    overnightBasePath: string
}

interface ControllerRoute {
    isOvernightRoute: boolean
    call: string
    path: string
    options: any
    method: RequestHandler
}

export class Server
{
    protected readonly app_: Application

    constructor()
    {
        this.app_ = express()
    }

    protected addControllers<T>(controllers: T | Array<T>): void
    {
        // Create array if only a single value is passed
        let ctlrs = (controllers instanceof Array) ? controllers : [controllers]
        let count = 0

        ctlrs.forEach(ctlr => {

            let ctrlPath = (<Controller><any>ctlr).overnightBasePath
            if(ctrlPath) {
                let router = this.getRouter(ctlr)
                count++
                this.app_.use(ctrlPath, router)
            }
        })

        cinfo(count + ` controller${count === 1 ? '' : 's'} configured.`)
    }

    private getRouter<T>(ctlr: T): Router
    {
        let router = Router()

        for(let member in ctlr) {
            
            let classAttr = <ControllerRoute><any>ctlr[member]; cerr(classAttr)

            if(classAttr.isOvernightRoute) { cerr(classAttr)
                switch (classAttr.call) {
                    case 'GET':
                        if(classAttr.options) {
                            router.get(classAttr.path, classAttr.options, classAttr.method)
                        } else {
                            router.get(classAttr.path, classAttr.method)
                        }
                        break
                    case 'POST':
                        if(classAttr.options) {
                            router.post(classAttr.path, classAttr.options, classAttr.method)
                        } else {
                            router.post(classAttr.path, classAttr.method)
                        }
                        break
                    case 'PUT':
                        if(classAttr.options) {
                            router.put(classAttr.path, classAttr.options, classAttr.method)
                        } else {
                            router.put(classAttr.path, classAttr.method)
                        }
                        break
                    case 'DELETE':
                        if(classAttr.options) {
                            router.delete(classAttr.path, classAttr.options, classAttr.method)
                        } else {
                            router.delete(classAttr.path, classAttr.method)
                        }
                        break
                }
            }
        }

        return router
    }
}
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

// interface ControllerRoute {
//     isOvernightRoute: boolean
//     call: string
//     path: string
//     options: any
//     method: RequestHandler
// }

export class Server
{
    protected readonly app_: Application

    constructor()
    {
        this.app_ = express()
    }

    protected addControllers<T> (controller: any)// (controllers: T | Array<T>): void
    {
        // Create array if only a single value is passed
        // let ctlrs = (controllers instanceof Array) ? controllers : [controllers]
        // let count = 0
        //
        // ctlrs.forEach(ctlr => {
        //
        //     let ctrlPath = (<Controller><any>ctlr).overnightBasePath
        //     if(ctrlPath) {
        //         let router = this.getRouter(ctlr)
        //         count++
        //         this.app_.use(ctrlPath, router)
        //     }
        // })
        //
        // cinfo(count + ` controller${count === 1 ? '' : 's'} configured.`)

        let router = Router()

        for(let member in controller) {


            if(controller[member].hasOwnProperty('overnightProperties')) {
                let callback = <any>controller[member]
                let params = (<any>controller[member]).overnightProperties

                switch (params.call)
                {
                    case 'GET':
                        if(params.options) {
                            router.get(params.path, params.options, callback)
                        }
                        else {
                            router.get(params.path, (req, res, next) => {
                                controller[member](req, res, next)
                            })
                        }
                        break

                    case 'POST':
                        if(params.options) {
                            router.post(params.path, params.options, callback)
                        }
                        else {
                            router.post(params.path, callback)
                        }
                        break

                    case 'PUT':
                        if(params.options) {
                            router.put(params.path, params.options, callback)
                        }
                        else {
                            router.put(params.path, callback)
                        }
                        break

                    case 'DELETE':
                        if(params.options) {
                            router.delete(params.path, params.options, callback)
                        }
                        else {
                            router.delete(params.path, callback)
                        }
                        break
                }
            }
        }

        this.app_.use(controller.overnightBasePath, router)
    }

    private getRouter<T>(ctlr: T): Router
    {
        let router = Router()

        for(let member in ctlr) {


            if(ctlr[member].hasOwnProperty('overnightProperties')) {
                let callback = <any>ctlr[member]
                let params = (<any>ctlr[member]).overnightProperties

                switch (params.call)
                {
                    case 'GET':
                        if(params.options) {
                            router.get(params.path, params.options, callback)
                        }
                        else {
                            router.get(params.path, function (req, res, next) {
                                callback(req, res, next)
                            })
                        }
                        break

                    case 'POST':
                        if(params.options) {
                            router.post(params.path, params.options, callback)
                        }
                        else {
                            router.post(params.path, callback)
                        }
                        break

                    case 'PUT':
                        if(params.options) {
                            router.put(params.path, params.options, callback)
                        }
                        else {
                            router.put(params.path, callback)
                        }
                        break

                    case 'DELETE':
                        if(params.options) {
                            router.delete(params.path, params.options, callback)
                        }
                        else {
                            router.delete(params.path, callback)
                        }
                        break
                }
            }
        }

        return router
    }
}
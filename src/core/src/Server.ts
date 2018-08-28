/**
 * Server super calls, for adding all controller routes to express server.
 *
 * created by Sean Maxwell Aug 26, 2018
 */

import * as express            from 'express'
import { cinfo, cerr }         from 'simple-color-print'
import { Application, Router } from 'express'


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

            if((<any>ctlr).onBasePath) {
                let router = this.getRouter(ctlr)
                this.app_.use((<any>ctlr).onBasePath, router)
                count++
            }
        })

        cinfo(count + ` controller${count === 1 ? '' : 's'} configured.`)
    }

    private getRouter(controller: any): Router
    {
        let router = Router()

        for(let member in controller) {

            if(controller[member].hasOwnProperty('onProperties')) {
                let params = controller[member].onProperties

                switch (params.call)
                {
                    case 'GET':
                        if(params.options) {
                            router.get(params.path, params.options, (req, res, next) => {
                                return controller[member](req, res, next)
                            })
                        }
                        else {
                            router.get(params.path, (req, res, next) => {
                                return controller[member](req, res, next)
                            })
                        }
                        break

                    case 'POST':
                        if(params.options) {
                            router.post(params.path, params.options, (req, res, next) => {
                                return controller[member](req, res, next)
                            })
                        }
                        else {
                            router.post(params.path, (req, res, next) => {
                                return controller[member](req, res, next)
                            })
                        }
                        break

                    case 'PUT':
                        if(params.options) {
                            router.put(params.path, params.options, (req, res, next) => {
                                return controller[member](req, res, next)
                            })
                        }
                        else {
                            router.put(params.path, (req, res, next) => {
                                return controller[member](req, res, next)
                            })
                        }
                        break

                    case 'DELETE':
                        if(params.options) {
                            router.delete(params.path, params.options, (req, res, next) => {
                                return controller[member](req, res, next)
                            })
                        }
                        else {
                            router.delete(params.path, (req, res, next) => {
                                return controller[member](req, res, next)
                            })
                        }
                        break
                }
            }
        }

        return router
    }
}
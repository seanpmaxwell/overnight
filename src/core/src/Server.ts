/**
 * Server super calls, for adding all controller routes to express server.
 *
 * created by Sean Maxwell Aug 26, 2018
 */

import * as express    from 'express'
import { Application } from 'express'


export class Server
{
    protected readonly app_: Application

    constructor()
    {
        this.app_ = express()
    }

    /***********************************************************************************************
     *                                      Setup Controllers
     **********************************************************************************************/

    protected addControllers_<T extends {}>(controllers: T | Array<T>, customRouterLib?: any): void
    {
        // Create array if only a single value is passed
        let ctlrs = (controllers instanceof Array) ? controllers : [controllers]
        let count = 0

        interface Controller {onBasePath?: string}

        ctlrs.forEach(ctlr => {

            let basePath = (<Controller>ctlr).onBasePath

            if(basePath) {

                let router

                if(customRouterLib) {
                    console.info('custom router added.')
                    router = this.getRouter(ctlr, customRouterLib)
                }
                else {
                    router = this.getRouter(ctlr, express.Router)
                }

                this.app_.use(basePath, router)
                count++
            }
        })

        console.log(count + ` controller${count === 1 ? '' : 's'} configured.`)
    }

    private getRouter(controller: any, RouterLib: any): any
    {
        let router = RouterLib()

        for(let member in controller)
        {
            if(controller[member].hasOwnProperty('onProperties')) {
                let params = controller[member].onProperties

                switch (params.call)
                {
                    case 'GET':
                        if(params.middleware) {
                            router.get(params.path, params.middleware, (req, res, next) => {
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
                        if(params.middleware) {
                            router.post(params.path, params.middleware, (req, res, next) => {
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
                        if(params.middleware) {
                            router.put(params.path, params.middleware, (req, res, next) => {
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
                        if(params.middleware) {
                            router.delete(params.path, params.middleware, (req, res, next) => {
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
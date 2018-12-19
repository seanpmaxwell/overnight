/**
 * Server super calls, for adding all controller routes to express server.
 *
 * created by Sean Maxwell Aug 26, 2018
 */

import * as express from 'express'
import { Application, Router } from 'express'


interface Controller {
    controllerBasePath?: string
}


export class Server
{
    private readonly _NOT_CTLR_ERR = 'Value passed was not a controller. Please make sure to use ' +
        'a TypeScript class with the @Controller decorator'

    protected readonly app_: Application

    constructor()
    {
        this.app_ = express()
    }

    /***********************************************************************************************
     *                                      Setup Controllers
     **********************************************************************************************/

    protected addControllers_<T extends object>(controllers: T | Array<T>, customRouterLib?: Function): void
    {
        let count = 0
        let routerLib = customRouterLib || express.Router

        if(controllers instanceof Array)
        {
            controllers.forEach(controller => {
                this._applyRouterObj(controller, routerLib)
                count++
            })
        }
        else
        {
            this._applyRouterObj(controllers, routerLib)
            count = 1
        }

        console.log(count + ` controller${count === 1 ? '' : 's'} configured.`)
    }

    private _applyRouterObj(controller: Controller, routerLib: Function): void
    {
        let basePath = controller.controllerBasePath

        // Make sure value passed is a controller
        if(!basePath) throw Error(this._NOT_CTLR_ERR)

        let router = this._getRouter(controller, routerLib)
        this.app_.use(basePath, router)
    }

    private _getRouter(controller: Controller, RouterLib: Function): Router
    {
        let router = RouterLib()

        for(let member in controller) {

            // Make sure route is a decorated overnight route call
            let routeProperties = controller[member].overnightRouteProperties
            if(!routeProperties) continue

            // Get, Put, Post, Delete
            let call = routeProperties.call.toLowerCase()

            if(routeProperties.middleware) {
                router[call](routeProperties.path, routeProperties.middleware, (req, res, next) => {
                    return controller[member](req, res, next)
                })
            }
            else {
                router[call](routeProperties.path, (req, res, next) => {
                    return controller[member](req, res, next)
                })
            }
        }

        return router
    }
}
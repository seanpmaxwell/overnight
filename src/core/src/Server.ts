/**
 * Server super calls, for adding all controller routes to express server.
 *
 * created by Sean Maxwell Aug 26, 2018
 */

import * as express    from 'express'
import { Application } from 'express'


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

    protected addControllers_<T extends {}>(controllers: T | Array<T>, customRouterLib?: Function): void
    {
        // Create array if only a single value is passed
        let ctlrs = (controllers instanceof Array) ? controllers : [controllers]
        let count = 0

        ctlrs.forEach(ctlr => {

            // Make Sure Value passed is a controller
            let basePath = (<Controller>ctlr).controllerBasePath

            if(!basePath) {
                throw Error(this._NOT_CTLR_ERR)
                return
            }

            // Use custom Router if one has been passed
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
        })

        console.log(count + ` controller${count === 1 ? '' : 's'} configured.`)
    }

    private getRouter(controller: Controller, RouterLib: Function): Function
    {
        let router = RouterLib()

        for(let member in controller) {

            // Make sure route has been decorated
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
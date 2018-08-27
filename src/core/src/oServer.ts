/**
 * Server super calls, for adding all controller routes to express server.
 *
 * created by Sean Maxwell Aug 26, 2018
 */

import * as express    from 'express'
import { oController } from './oController'
import { cinfo, cerr } from 'simple-color-print'
import { Application, Router } from 'express'


export class oServer
{
    protected readonly app_: Application = express()

    protected addControllers(controllers: Array<oController>): void
    {
        // loop the array
        // within each loop call this.app.use(controller.basePath, controller.getRouter())
        controllers.forEach(controller => {
            // let methods = this.getMethods(controller)
            let router = Router()

            for (let member in controller) {  // For each member of the dictionary
                if (typeof (<any>controller)[member] == 'function') {
                    cinfo(member);// Is it a function?
                    // Do some kind of check to make sure that's the specialPrototype, change function to object
                }
            }


            // methods.forEach(method => { cinfo(method)
            //     let routerMethodPrototype = (<any>controller)[method]
            //
            //     if(routerMethodPrototype.method === 'Get') {
            //         router.get(routerMethodPrototype.route, routerMethodPrototype.middleware,
            //             routerMethodPrototype.callback)
            //     }
            //
            //     // Do the same here for all other route types
            // })

            this.app_.use(controller.getBasePath(), router)
        })

        cinfo(controllers.length + ' controllers configured.')
    }

    private getMethods(instance: any): Array<string>
    {
        return Object.getOwnPropertyNames(instance)
    }
}
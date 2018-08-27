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
        controllers.forEach(ctrl => {

            let router = Router()

            for(let member in ctrl) {

                if(typeof (<any>ctrl)[member] == 'object') {

                    if(member === 'getOne') {
                        cinfo((<any>ctrl)[member])
                    }

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

            this.app_.use(ctrl.getBasePath(), router)
        })

        cinfo(controllers.length + ' controllers configured.')
    }
}
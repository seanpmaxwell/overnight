/**
 * Server super calls, for adding all controller routes to express server.
 *
 * created by Sean Maxwell Aug 26, 2018
 */

import * as express from 'express';
import { Application, Request, Response, NextFunction, Router } from 'express';


interface OvernightRoute {
    (...args: any[]): any;
    overnightRouteProperties: any;
}

interface ControllerInstance {
    [key: string]: any;
    controllerBasePath?: string;
}

export class Server {

    private readonly _APP: Application;


    constructor() {
        this._APP = express();
    }


    protected get app(): Application {
        return this._APP;
    }



    /***********************************************************************************************
     *                                      Setup Controllers
     **********************************************************************************************/

    /**
     * If controllers === undefined, search the './controllers' directory. If it is a string,
     * search that directory instead. If it is an instance-object or array instance-objects,
     * don't pull in the controllers automatically.
     */
    protected addControllers(controllers: ControllerInstance | ControllerInstance[],
                             customRouterLib?: Function): void {

        let ctlrInstances: ControllerInstance[] = [];

        if (controllers instanceof Array) {
            ctlrInstances = controllers;
        } else {
            ctlrInstances.push(controllers);
        }

        let count = 0;
        let routerLib = customRouterLib || Router;

        ctlrInstances.forEach(controller => {
            if (controller && controller.controllerBasePath) {
                let router = this._getRouter(controller, routerLib);
                this.app.use(controller.controllerBasePath, router);
                count++;
            }
        });

        let s = count === 1 ? '' : 's';
        console.log(count +  ` controller${s} configured.`);
    }


    private _getRouter(controller: ControllerInstance, RouterLib: Function): Router {

        let router = RouterLib();

        for (let member in controller) {

            let route = (controller)[member] as OvernightRoute;

            if (route && route.overnightRouteProperties) {

                let { middleware, httpVerb, path } = route.overnightRouteProperties;

                let callBack = (req: Request, res: Response, next: NextFunction) => {
                    return ((controller)[member] as OvernightRoute)(req, res, next);
                };

                if (middleware) {
                    router[httpVerb](path, middleware, callBack);
                } else {
                    router[httpVerb](path, callBack);
                }
            }
        }

        return router;
    }
}

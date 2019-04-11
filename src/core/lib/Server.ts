/**
 * Server super calls, for adding all controller routes to express server.
 *
 * created by Sean Maxwell Aug 26, 2018
 */

import * as express from 'express';
import { Application, Request, Response, NextFunction, Router } from 'express';


export class Server {

    private readonly _app: Application;


    constructor() {
        this._app = express();
    }

    protected get app(): Application {
        return this._app;
    }


    /**
     * If controllers === undefined, search the './controllers' directory. If it is a string,
     * search that directory instead. If it is an instance-object or array instance-objects,
     * don't pull in the controllers automatically.
     */
    protected addControllers(controllers: InstanceType<any> | Array<InstanceType<any>>,
                             customRouterLib?: () => any, showLog?: boolean): void {

        let ctlrInstances = [];

        // Convert to array if single controller
        if (controllers instanceof Array) {
            ctlrInstances = controllers;
        } else {
            ctlrInstances.push(controllers);
        }

        let count = 0;
        const routerLib = customRouterLib || Router;

        // Init route in each controller
        ctlrInstances.forEach((controller) => {
            if (controller && controller.controllerBasePath) {
                const router = this.getRouter(controller, routerLib);
                this.app.use(controller.controllerBasePath, router);
                count++;
            }
        });

        if (showLog) {
            const s = count === 1 ? ' controller' : ' controllers';
            // tslint:disable-next-line
            console.log(count + s + ' configured.');
        }
    }


    private getRouter(controller: InstanceType<any>, routerLib: () => any): Router {

        const router = routerLib();
        const prototype = controller.__proto__.__proto__;

        // Iterate each controller-instance's parent function
        for (const member in prototype) {
            if (prototype.hasOwnProperty(member)) {

                const route = controller[member];
                if (route && route.overnightRouteProperties) {

                    const { middleware, httpVerb, path } = route.overnightRouteProperties;

                    const callBack = (req: Request, res: Response, next: NextFunction) => {
                        return controller[member](req, res, next);
                    };

                    if (middleware) {
                        router[httpVerb](path, middleware, callBack);
                    } else {
                        router[httpVerb](path, callBack);
                    }
                }
            }
        }

        return router;
    }
}

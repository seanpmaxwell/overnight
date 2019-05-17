/**
 * Server super calls, for adding all controller routes to express server.
 *
 * created by Sean Maxwell Aug 26, 2018
 */

import * as express from 'express';
import { Application, Request, Response, NextFunction, Router } from 'express';
import { BASE_PATH_KEY } from './ClassDecorators';

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
     * @param controllers
     * @param customRouterLib
     * @param showLog
     */
    protected addControllers(controllers: InstanceType<any> | Array<InstanceType<any>>,
                             customRouterLib?: (() => any) | null,
                             showLog?: boolean): void {
        // Convert to array if single controller
        let ctlrInstances = [];
        if (controllers instanceof Array) {
            ctlrInstances = controllers;
        } else {
            ctlrInstances.push(controllers);
        }
        // Init route in each controller
        let count = 0;
        const routerLib = customRouterLib || Router;
        ctlrInstances.forEach((controller) => {
            if (controller && controller.__proto__) {
                const prototype = Object.getPrototypeOf(controller);
                const basePath = Reflect.getOwnMetadata(BASE_PATH_KEY, prototype);
                if (basePath) {
                    const router = this.getRouter(controller, routerLib);
                    this.app.use(basePath, router);
                    count++;
                }
            }
        });
        if (showLog) {
            const s = count === 1 ? ' controller' : ' controllers';
            // tslint:disable-next-line
            console.log(count + s + ' configured.');
        }
    }


    /**
     * Get a single router object for each controller. Router object extracts
     * metadata for each class method and each property which is an array function.
     * @param routerLib
     * @param controller
     */
    private getRouter(routerLib: () => any, controller: InstanceType<any> | (() => any)): Router {
        const router = routerLib();
        const prototype = Object.getPrototypeOf(controller);
        let members = Object.getOwnPropertyNames(controller);
        members = members.concat(Object.getOwnPropertyNames(prototype));

        members.forEach((member) => {
            const route = controller[member];
            if (route && route.overnightRouteProperties) { // pick up here, use metadata
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
        });
        return router;
    }
}

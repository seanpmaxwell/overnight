/**
 * Server super calls, for adding all controller routes to express server.
 *
 * created by Sean Maxwell Aug 26, 2018
 */

import * as express from 'express';
import { Application, Request, Response, NextFunction } from 'express';
import { BASE_PATH_KEY, CLASS_MIDDLEWARE_KEY } from './decorators';

type Controllers = InstanceType<any> | Array<InstanceType<any>>;

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
    protected addControllers(controllers: Controllers, routerLib?: (() => any) | null,
                             showLog?: boolean): void {
        let count = 0;
        controllers = (controllers instanceof Array) ? controllers : [controllers];
        controllers.forEach((controller: InstanceType<any>) => {
            if (controller) {
                const prototype = Object.getPrototypeOf(controller);
                const basePath = Reflect.getOwnMetadata(BASE_PATH_KEY, prototype);
                if (basePath) {
                    const router = this.getRouter(routerLib || express.Router, controller);
                    this.app.use(basePath, router);
                    count++;
                }
            }
        });
        if (showLog) {
            // tslint:disable-next-line
            console.log(count + ' controller/s configured.');
        }
    }


    /**
     * Get a single router object for each controller. Router object extracts
     * metadata for each class method and each property which is an array function.
     * @param routerLib
     * @param controller
     */
    private getRouter(routerLib: (() => any), controller: InstanceType<any>): express.Router {
        const router = routerLib();
        const prototype = Object.getPrototypeOf(controller);
        // Set class-wide middleware
        const classMiddleware = Reflect.getOwnMetadata(CLASS_MIDDLEWARE_KEY, prototype);
        if (classMiddleware) {
            router.use(classMiddleware);
        }
        // Get members of both instance and prototype
        let members = Object.getOwnPropertyNames(controller);
        members = members.concat(Object.getOwnPropertyNames(prototype));
        // Set all routes using class functions and properties whose values are functions
        members.forEach((member) => {
            const route = controller[member];
            const routeProperties = Reflect.getOwnMetadata(member, prototype);
            if (route && routeProperties) {
                const { routeMiddleware, httpVerb, path } = routeProperties;
                const callBack = (req: Request, res: Response, next: NextFunction) => {
                    return controller[member](req, res, next);
                };
                if (routeMiddleware) {
                    router[httpVerb](path, routeMiddleware, callBack);
                } else {
                    router[httpVerb](path, callBack);
                }
            }
        });
        return router;
    }
}

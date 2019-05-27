/**
 * Server super calls, for adding all controller routes to express server.
 *
 * created by Sean Maxwell Aug 26, 2018
 */

import * as express from 'express';
import { Application, Request, Response, Router, IRouter, NextFunction } from 'express';
import { BASE_PATH_KEY, CLASS_MIDDLEWARE_KEY, CHILDREN_KEY } from './decorators';


type Controller = InstanceType<any>;
type RouterLib = (() => any) | null;

interface IRouterAndPath {
    basePath: string | null;
    router: Router | null;
}

export class Server {

    private readonly _app: Application;
    private _showLogs = false;

    private readonly LOG_STR = 'Setting up controller ';


    constructor() {
        this._app = express();
    }

    protected get app(): Application {
        return this._app;
    }

    protected get showLogs(): boolean {
        return this._showLogs;
    }

    protected set showLogs(showLogs: boolean) {
        this._showLogs = showLogs;
    }

    /**
     * If controllers === undefined, search the './controllers' directory. If it is a string,
     * search that directory instead. If it is an instance-object or array instance-objects,
     * don't pull in the controllers automatically.
     * @param controllers
     * @param customRouterLib
     * @param showLog
     */
    protected addControllers(controllers: Controller | Controller[], routerLib?: RouterLib): void {
        controllers = (controllers instanceof Array) ? controllers : [controllers];
        controllers.forEach((controller: Controller) => {
            if (controller) {
                const { basePath, router } = this.getRouter(routerLib || Router, controller);
                if (basePath && router) {
                    this.app.use(basePath, router);
                }
            }
        });
    }


    /**
     * Get a single router object for each controller. Router object extracts
     * metadata for each class method and each property which is an array function.
     * @param routerLib
     * @param controller
     */
    private getRouter(routerLibrary: (() => any), controller: Controller): IRouterAndPath {
        const router = routerLibrary();
        const prototype = Object.getPrototypeOf(controller);
        // Get base path
        const basePath = Reflect.getOwnMetadata(BASE_PATH_KEY, prototype);
        if (!basePath) {
            return {
                basePath: null,
                router: null,
            };
        }
        // Show logs
        if (this.showLogs) {
            // tslint:disable-next-line
            console.log(this.LOG_STR + controller.constructor.name);
        }
        // Get middleware
        const classMiddleware = Reflect.getOwnMetadata(CLASS_MIDDLEWARE_KEY, prototype);
        if (classMiddleware) {
            router.use(classMiddleware);
        }
        // Add paths/functions to router-object
        let members = Object.getOwnPropertyNames(controller);
        members = members.concat(Object.getOwnPropertyNames(prototype));
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
        // Add child controllers
        let children = Reflect.getOwnMetadata(CHILDREN_KEY, prototype);
        if (children) {
            children = (children instanceof Array) ? children : [children];
            children.forEach((child: Controller) => {
                const childRouterAndPath = this.getRouter(routerLibrary, child);
                if (childRouterAndPath.router) {
                    router.use(childRouterAndPath.basePath, childRouterAndPath.router);
                }
            });
        }
        return {
            basePath,
            router,
        };
    }
}

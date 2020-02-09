/**
 * Server super calls, for adding all controller routes to express server.
 *
 * created by Sean Maxwell Aug 26, 2018
 */

import 'reflect-metadata';
import * as express from 'express';
import { Application, Request, Response, Router, NextFunction, ErrorRequestHandler, RequestHandler } from 'express';

import {ClassKeys, HttpVerb} from './decorators/types';


type Controller = InstanceType<any>;
type RouterLib = ((options?: any) => any);

interface IRouterAndPath {
    basePath: string | null;
    router: Router | null;
}

export class Server {

    private readonly _app: Application;
    private _showLogs = false;

    private readonly LOG_STR = 'Setting up controller ';


    constructor(showLogs?: boolean) {
        this._app = express();
        this._showLogs = showLogs || false;
    }

    public get app(): Application {
        return this._app;
    }

    public get showLogs(): boolean {
        return this._showLogs;
    }

    public set showLogs(showLogs: boolean) {
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
    public addControllers(controllers: Controller | Controller[], routerLib?: RouterLib): void {
        controllers = (controllers instanceof Array) ? controllers : [controllers];
        const routerLibrary = routerLib || Router;
        controllers.forEach((controller: Controller) => {
            if (controller) {
                const { basePath, router } = this.getRouter(routerLibrary, controller);
                if (basePath && router) {
                    this.app.use(basePath, router);
                }
            }
        });
    }


    private wrapErrorMiddleware(errorMiddleware: ErrorRequestHandler, requestHandler: RequestHandler) {
        const wrapped = (req: Request, res: Response, next: NextFunction) => {
            try {
                requestHandler(req, res, next);
            } catch (error) {
                errorMiddleware(error, req, res, next);
            }
        };
        return wrapped;
    }


    /**
     * Get a single router object for each controller. Router object extracts
     * metadata for each class method and each property which is an array function.
     * @param routerLib
     * @param controller
     */
    private getRouter(routerLibrary: RouterLib, controller: Controller): IRouterAndPath {
        const prototype = Object.getPrototypeOf(controller);
        const options = Reflect.getOwnMetadata(ClassKeys.Options, prototype);

        // Set options
        let router: any;
        if (options) {
            router = routerLibrary(options);
        } else {
            router = routerLibrary();
        }
        // Get base path
        const basePath = Reflect.getOwnMetadata(ClassKeys.BasePath, prototype);
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
        const classMiddleware = Reflect.getOwnMetadata(ClassKeys.Middleware, prototype);
        if (classMiddleware) {
            router.use(classMiddleware);
        }
        // Get class-wrapper
        const classWrapper = Reflect.getOwnMetadata(ClassKeys.Wrapper, prototype);

        // Add paths/functions to router-object
        let members = Object.getOwnPropertyNames(controller);
        members = members.concat(Object.getOwnPropertyNames(prototype));
        members.forEach((member) => {
            const route = controller[member];
            const routeProperties = Reflect.getOwnMetadata(member, prototype);
            if (route && routeProperties) {
                const { routeMiddleware, routeErrorMiddleware, httpVerbs, routeWrapper } = routeProperties;
                let callBack = (req: Request, res: Response, next: NextFunction) => {
                    return controller[member](req, res, next);
                };
                if (classWrapper) {
                    callBack = classWrapper(callBack);
                }
                if (routeWrapper) {
                    callBack = routeWrapper(callBack);
                }
                if (routeErrorMiddleware) {
                    if (routeErrorMiddleware instanceof Array) {
                        routeErrorMiddleware.forEach((errorMiddleware) => {
                            callBack = this.wrapErrorMiddleware(errorMiddleware, callBack);
                        });
                    } else {
                        callBack = this.wrapErrorMiddleware(routeErrorMiddleware, callBack);
                    }
                }
                if (routeMiddleware) {
                    httpVerbs.forEach((verbAndPath: {httpVerb: HttpVerb | 'any', path: string | RegExp}) => {
                        router[verbAndPath.httpVerb](verbAndPath.path, routeMiddleware, callBack);
                    });
                } else {
                    httpVerbs.forEach((verbAndPath: {httpVerb: HttpVerb | 'any', path: string | RegExp}) => {
                        router[verbAndPath.httpVerb](verbAndPath.path, callBack);
                    });
                }
            }
        });

        // Recursively add child controllers
        let children = Reflect.getOwnMetadata(ClassKeys.Children, prototype);
        if (children) {
            children = (children instanceof Array) ? children : [children];
            children.forEach((child: Controller) => {
                const childRouterAndPath = this.getRouter(routerLibrary, child);
                if (childRouterAndPath.router) {
                    router.use(childRouterAndPath.basePath, childRouterAndPath.router);
                }
            });
        }

        // Get error middleware
        const classErrorMiddleware = Reflect.getOwnMetadata(ClassKeys.ErrorMiddleware, prototype);
        if (classErrorMiddleware) {
            router.use(classErrorMiddleware);
        }

        return {
            basePath,
            router,
        };
    }
}

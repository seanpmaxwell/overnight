/**
 * Server super calls, for adding all controller routes to express server.
 *
 * created by Sean Maxwell Aug 26, 2018
 */

import 'reflect-metadata';
import * as express from 'express';
import {
    Application,
    IRouter,
    NextFunction,
    Request,
    RequestHandler,
    Response,
    Router,
} from 'express';
import {PathParams} from 'express-serve-static-core';

import {
    classMetadataKey,
    Controller,
    ErrorMiddleware,
    IClassMetadata,
    IHttpRoute,
    IMethodMetadata,
    RouterLib,
} from './decorators/types';


interface IRouterAndPath {
    basePath: PathParams;
    router: RequestHandler;
}

export class Server {

    private readonly _app: Application;
    private _showLogs: boolean = false;

    private readonly LOG_STR: string = 'Setting up controller ';


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
     * @param routerLib
     */
    public addControllers(controllers: Controller | Controller[], routerLib?: RouterLib): void {
        controllers = (controllers instanceof Array) ? controllers : [controllers];
        const routerLibrary: RouterLib = routerLib || Router;
        controllers.forEach((controller: Controller) => {
            if (controller) {
                const routerAndPath: IRouterAndPath | null = this.getRouter(routerLibrary, controller);
                if (routerAndPath) {
                    this.app.use(routerAndPath.basePath, routerAndPath.router);
                }
            }
        });
    }


    private wrapErrorMiddleware(errorMiddleware: ErrorMiddleware, requestHandler: RequestHandler): RequestHandler {
        return (req: Request, res: Response, next: NextFunction): void => {
            try {
                requestHandler(req, res, next);
            } catch (error) {
                errorMiddleware(error, req, res, next);
            }
        };
    }


    /**
     * Get a single router object for each controller. Router object extracts
     * metadata for each class method and each property which is an array function.
     * @param routerLibrary
     * @param controller
     */
    private getRouter(routerLibrary: RouterLib, controller: Controller): IRouterAndPath | null {
        const prototype: any = Object.getPrototypeOf(controller);
        const classMetadata: IClassMetadata | undefined = Reflect.getOwnMetadata(classMetadataKey, prototype);

        // If this object does not have any metadata, stop now
        if (!classMetadata) {
            return null;
        }

        const {
            basePath,
            childControllers: children,
            errorMiddlewares: classErrorMiddleware,
            middlewares: classMiddleware,
            options,
            wrapper: classWrapper,
        }: IClassMetadata = classMetadata;

        // If this basePath is undefined, stop now
        if (!basePath) {
            return null;
        }

        // Set options
        const router: IRouter = routerLibrary(options);


        // Show logs
        if (this.showLogs) {
            // tslint:disable-next-line:no-console
            console.log(this.LOG_STR + controller.constructor.name);
        }
        // Get middleware
        if (classMiddleware) {
            router.use(classMiddleware);
        }

        // Add paths/functions to router-object
        // tslint:disable-next-line:forin
        for (const member in controller) {
            const methodMetadata: IMethodMetadata | undefined = Reflect.getOwnMetadata(member, prototype);
            if (methodMetadata) {
                const { httpRoutes, middlewares, errorMiddlewares, wrapper }: IMethodMetadata = methodMetadata;
                let callBack: (...args: any[]) => any = controller[member];
                if (classWrapper) {
                    callBack = classWrapper(callBack);
                }
                if (wrapper) {
                    callBack = wrapper(callBack);
                }
                if (errorMiddlewares) {
                    errorMiddlewares.forEach((errorMiddleware: ErrorMiddleware) => {
                        callBack = this.wrapErrorMiddleware(errorMiddleware, callBack);
                    });
                }
                if (httpRoutes) {
                    httpRoutes.forEach((route: IHttpRoute) => {
                        const { httpDecorator, path }: IHttpRoute = route;
                        if (middlewares) {
                            router[httpDecorator](path, middlewares, callBack);
                        } else {
                            router[httpDecorator](path, callBack);
                        }
                    });
                }
            }
        }

        // Recursively add child controllers
        if (children) {
            children.forEach((child: Controller) => {
                const childRouterAndPath: IRouterAndPath | null = this.getRouter(routerLibrary, child);
                if (childRouterAndPath) {
                    router.use(childRouterAndPath.basePath, childRouterAndPath.router);
                }
            });
        }

        // Get error middleware
        if (classErrorMiddleware) {
            router.use(classErrorMiddleware);
        }

        return {
            basePath,
            router,
        };
    }
}

/**
 * Server super calls, for adding all controller routes to express server.
 *
 * created by Sean Maxwell Aug 26, 2018
 */

import * as express from 'express';
import { Application, Request, Response, NextFunction, Router } from 'express';

// @ts-ignore
import * as requireAll from 'require-all';



interface OvernightRoute {
    (...args: any[]): any;
    overnightRouteProperties: any;
}

interface ControllerInstance {
    [key: string]: any;
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
    protected addControllers(controllersOrDir?: string | ControllerInstance | ControllerInstance[],
                             customRouterLib?: Function): void {

        let ctlrInstances = [];

        if (!controllersOrDir) {
            ctlrInstances = this._findAndInitCtlrs('controllers');
        } else if (typeof controllersOrDir === 'string') {
            ctlrInstances = this._findAndInitCtlrs(controllersOrDir);
        } else if (!(controllersOrDir instanceof Array)) {
            ctlrInstances.push(controllersOrDir);
        }

        let count = 0;
        let routerLib = customRouterLib || Router;

        ctlrInstances.forEach(controller => {
            let router = this._getRouter(controller, routerLib);
            this.app.use(controller.controllerBasePath, router);
            count++;
        });

        let s = count === 1 ? '' : 's';
        console.log(count +  ` controller${s} configured.`);
    }


    private _findAndInitCtlrs(ctlrDir: string): ControllerInstance[] {

        const currDir = process.argv[1];
        const dirs = currDir.split('/');
        const dirname = currDir.replace(dirs[dirs.length-1], ctlrDir);

        const retVal: any = [];

        const resolve = (file: any) => {

            for (const member in file) {
                if (file.hasOwnProperty(member) && (typeof file[member] === 'function')) {
                    const ctlrInstance = new file[member]();
                    if (ctlrInstance.controllerBasePath) {
                        retVal.push(ctlrInstance);
                    }
                }
            }
        };

        requireAll({dirname, resolve, recursive: true});
        return retVal;
    }


    private _getRouter(controller: any, RouterLib: Function): Router {

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

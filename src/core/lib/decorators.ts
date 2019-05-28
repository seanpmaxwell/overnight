/**
 * Route Decorators for the Overnight web-framework. Link to all routes for ExpressJS:
 * https://expressjs.com/en/api.html#routing-methods.
 *
 * created by Sean Maxwell Aug 27, 2018
 */

import { Request, Response, NextFunction, RouterOptions } from 'express';
import 'reflect-metadata';


/***********************************************************************************************
 *                                      Method Decorators
 **********************************************************************************************/

export function Checkout(path?: string): MethodDecorator {
    return helperForRoutes('checkout', path);
}

export function Copy(path?: string): MethodDecorator {
    return helperForRoutes('copy', path);
}

export function Delete(path?: string): MethodDecorator {
    return helperForRoutes('delete', path);
}

export function Get(path?: string): MethodDecorator {
    return helperForRoutes('get', path);
}

export function Head(path?: string): MethodDecorator {
    return helperForRoutes('head', path);
}

export function Lock(path?: string): MethodDecorator {
    return helperForRoutes('lock', path);
}

export function Merge(path?: string): MethodDecorator {
    return helperForRoutes('merge', path);
}

export function Mkactivity(path?: string): MethodDecorator {
    return helperForRoutes('mkactivity', path);
}

export function Mkcol(path?: string): MethodDecorator {
    return helperForRoutes('mkcol', path);
}

export function Move(path?: string): MethodDecorator {
    return helperForRoutes('move', path);
}

export function MSearch(path?: string): MethodDecorator {
    return helperForRoutes('m-search', path);
}

export function Notify(path?: string): MethodDecorator {
    return helperForRoutes('notify', path);
}

export function Options(path?: string): MethodDecorator {
    return helperForRoutes('options', path);
}

export function Patch(path?: string): MethodDecorator {
    return helperForRoutes('patch', path);
}

export function Post(path?: string): MethodDecorator {
    return helperForRoutes('post', path);
}

export function Purge(path?: string): MethodDecorator {
    return helperForRoutes('purge', path);
}

export function Put(path?: string): MethodDecorator {
    return helperForRoutes('put', path);
}

export function Report(path?: string): MethodDecorator {
    return helperForRoutes('report', path);
}

export function Search(path?: string): MethodDecorator {
    return helperForRoutes('search', path);
}

export function Subscribe(path?: string): MethodDecorator {
    return helperForRoutes('subscribe', path);
}

export function Trace(path?: string): MethodDecorator {
    return helperForRoutes('trace', path);
}

export function Unlock(path?: string): MethodDecorator {
    return helperForRoutes('unlock', path);
}

export function Unsubscribe(path?: string): MethodDecorator {
    return helperForRoutes('unsubscribe', path);
}

function helperForRoutes(httpVerb: string, path?: string): MethodDecorator {

    return (target: any, propertyKey: string | symbol, descriptor?: PropertyDescriptor) => {
        let routeProperties = Reflect.getOwnMetadata(propertyKey, target);
        if (!routeProperties) {
            routeProperties = {};
        }
        routeProperties = {
            httpVerb,
            path: path ? ('/' + path) : '',
            ...routeProperties,
        };
        Reflect.defineMetadata(propertyKey, routeProperties, target);
        if (descriptor) {
            return descriptor;
        }
    };
}


/***********************************************************************************************
 *                                       Class Decorator
 **********************************************************************************************/

export const BASE_PATH_KEY = 'basePath';
export const CLASS_MIDDLEWARE_KEY = 'classMiddleware';
export const CHILDREN_KEY = 'children';
export const OPTIONS_KEY = 'classOptions';

export function Controller(path: string): ClassDecorator {

    // tslint:disable-next-line:ban-types
    return <TFunction extends Function>(target: TFunction) => {
        Reflect.defineMetadata(BASE_PATH_KEY, '/' + path, target.prototype);
        return target;
    };
}

export function ClassMiddleware(middleware: Middlware | Middlware[]): ClassDecorator {

    // tslint:disable-next-line:ban-types
    return <TFunction extends Function>(target: TFunction) => {
        Reflect.defineMetadata(CLASS_MIDDLEWARE_KEY, middleware, target.prototype);
        return target;
    };
}

export function ClassOptions(options: RouterOptions): ClassDecorator {

    // tslint:disable-next-line:ban-types
    return <TFunction extends Function>(target: TFunction) => {
        Reflect.defineMetadata(OPTIONS_KEY, options, target.prototype);
        return target;
    };
}

export function Children(middleware: InstanceType<any> | Array<InstanceType<any>>): ClassDecorator {

    // tslint:disable-next-line:ban-types
    return <TFunction extends Function>(target: TFunction) => {
        Reflect.defineMetadata(CHILDREN_KEY, middleware, target.prototype);
        return target;
    };
}


/***********************************************************************************************
 *                                  Middleware Decorator
 **********************************************************************************************/

type Middlware = (req: Request, res: Response, next: NextFunction) => any;


export function Middleware(middleware: Middlware | Middlware[]): MethodDecorator {

    return (target: any, propertyKey?: string | symbol, descriptor?: PropertyDescriptor) => {
        let routeProperties = Reflect.getOwnMetadata(propertyKey, target);
        if (!routeProperties) {
            routeProperties = {};
        }
        routeProperties = {
            routeMiddleware: middleware,
            ...routeProperties,
        };
        Reflect.defineMetadata(propertyKey, routeProperties, target);
        // For class methods that are not arrow functions
        if (descriptor) {
            return descriptor;
        }
    };
}


/***********************************************************************************************
 *                                  Wrapper Decorator
 **********************************************************************************************/

type WrapperFunction = (request: Request, response: Response, next?: NextFunction) => any;

export function Wrapper(wrapperFunction: WrapperFunction) {

    return (target: any, propertyKey: string | symbol, descriptor?: PropertyDescriptor) => {
        let routeProperties = Reflect.getOwnMetadata(propertyKey, target);
        if (!routeProperties) {
            routeProperties = {};
        }
        routeProperties = {
            wrapper: wrapperFunction,
            ...routeProperties,
        };
        Reflect.defineMetadata(propertyKey, routeProperties, target);
        if (descriptor) {
            return descriptor;
        }
    };
}

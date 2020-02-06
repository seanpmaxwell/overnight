/**
 * Route Decorators for the Overnight web-framework. Link to all routes for ExpressJS:
 * https://expressjs.com/en/api.html#routing-methods.
 *
 * created by Sean Maxwell Aug 27, 2018
 */

import { RequestHandler, ErrorRequestHandler, RouterOptions } from 'express';
import 'reflect-metadata';


// Types
type Middleware = RequestHandler;
type ErrorMiddleware = ErrorRequestHandler;
type WrapperFunction = ((action: any) => any);
type Controller = InstanceType<any>;


/***********************************************************************************************
 *                                      Method Decorators
 **********************************************************************************************/

export function Checkout(path?: string | RegExp): MethodDecorator {
    return helperForRoutes('checkout', path);
}

export function Copy(path?: string | RegExp): MethodDecorator {
    return helperForRoutes('copy', path);
}

export function Delete(path?: string | RegExp): MethodDecorator {
    return helperForRoutes('delete', path);
}

export function Get(path?: string | RegExp): MethodDecorator {
    return helperForRoutes('get', path);
}

export function Head(path?: string | RegExp): MethodDecorator {
    return helperForRoutes('head', path);
}

export function Lock(path?: string | RegExp): MethodDecorator {
    return helperForRoutes('lock', path);
}

export function Merge(path?: string | RegExp): MethodDecorator {
    return helperForRoutes('merge', path);
}

export function Mkactivity(path?: string | RegExp): MethodDecorator {
    return helperForRoutes('mkactivity', path);
}

export function Mkcol(path?: string | RegExp): MethodDecorator {
    return helperForRoutes('mkcol', path);
}

export function Move(path?: string | RegExp): MethodDecorator {
    return helperForRoutes('move', path);
}

export function MSearch(path?: string | RegExp): MethodDecorator {
    return helperForRoutes('m-search', path);
}

export function Notify(path?: string | RegExp): MethodDecorator {
    return helperForRoutes('notify', path);
}

export function Options(path?: string | RegExp): MethodDecorator {
    return helperForRoutes('options', path);
}

export function Patch(path?: string | RegExp): MethodDecorator {
    return helperForRoutes('patch', path);
}

export function Post(path?: string | RegExp): MethodDecorator {
    return helperForRoutes('post', path);
}

export function Purge(path?: string | RegExp): MethodDecorator {
    return helperForRoutes('purge', path);
}

export function Put(path?: string | RegExp): MethodDecorator {
    return helperForRoutes('put', path);
}

export function Report(path?: string | RegExp): MethodDecorator {
    return helperForRoutes('report', path);
}

export function Search(path?: string | RegExp): MethodDecorator {
    return helperForRoutes('search', path);
}

export function Subscribe(path?: string | RegExp): MethodDecorator {
    return helperForRoutes('subscribe', path);
}

export function Trace(path?: string | RegExp): MethodDecorator {
    return helperForRoutes('trace', path);
}

export function Unlock(path?: string | RegExp): MethodDecorator {
    return helperForRoutes('unlock', path);
}

export function Unsubscribe(path?: string | RegExp): MethodDecorator {
    return helperForRoutes('unsubscribe', path);
}

function helperForRoutes(httpVerb: string, path?: string | RegExp): MethodDecorator {

    return (target: any, propertyKey: string | symbol, descriptor?: PropertyDescriptor) => {
        let routeProperties = Reflect.getOwnMetadata(propertyKey, target);
        if (!routeProperties) {
            routeProperties = {};
        }
        routeProperties = {
            httpVerb,
            ...routeProperties,
        };
        if (path === undefined) {
            routeProperties.path = '';
        } else if (path instanceof RegExp) {
            if (path.toString().charAt(1) === '^') {
                //  /^api$/ -> //api$/
                routeProperties.path = new RegExp('/' + path.toString().slice(2).replace(/\/$/, ''));
            } else {
                //  /api/ -> //.*api/
                routeProperties.path = new RegExp('/.*' + path.toString().slice(1).replace(/\/$/, ''));
            }
        } else {
            // path is a string
            routeProperties.path = '/' + path;
        }
        Reflect.defineMetadata(propertyKey, routeProperties, target);
        if (descriptor) {
            return descriptor;
        }
    };
}


/***********************************************************************************************
 *                                       Class Decorator
 **********************************************************************************************/

export enum ClassKeys {
    BasePath = 'BASE_PATH',
    Middleware = 'MIDDLEWARE',
    ErrorMiddleware = 'ERROR_MIDDLEWARE',
    Wrapper = 'WRAPPER',
    Children = 'CHILDREN',
    Options = 'OPTIONS',
}

export function Controller(path: string): ClassDecorator {

    // tslint:disable-next-line:ban-types
    return <TFunction extends Function>(target: TFunction) => {
        Reflect.defineMetadata(ClassKeys.BasePath, '/' + path, target.prototype);
        return target;
    };
}

export function ClassMiddleware(middleware: Middleware | Middleware[]): ClassDecorator {

    // tslint:disable-next-line:ban-types
    return <TFunction extends Function>(target: TFunction) => {
        Reflect.defineMetadata(ClassKeys.Middleware, middleware, target.prototype);
        return target;
    };
}

export function ClassErrorMiddleware(middleware: ErrorMiddleware | ErrorMiddleware[]): ClassDecorator {

    // tslint:disable-next-line:ban-types
    return <TFunction extends Function>(target: TFunction) => {
        Reflect.defineMetadata(ClassKeys.ErrorMiddleware, middleware, target.prototype);
        return target;
    };
}


export function ClassWrapper(wrapperFunction: WrapperFunction): ClassDecorator {

    // tslint:disable-next-line:ban-types
    return <TFunction extends Function>(target: TFunction) => {
        Reflect.defineMetadata(ClassKeys.Wrapper, wrapperFunction, target.prototype);
        return target;
    };
}

export function ClassOptions(options: RouterOptions): ClassDecorator {

    // tslint:disable-next-line:ban-types
    return <TFunction extends Function>(target: TFunction) => {
        Reflect.defineMetadata(ClassKeys.Options, options, target.prototype);
        return target;
    };
}

export function Children(controllers: Controller | Controller[]): ClassDecorator {

    // tslint:disable-next-line: no-console
    console.log('Warning: @Children decorator is deprecated. Use ChildControllers instead.');

    // tslint:disable-next-line:ban-types
    return <TFunction extends Function>(target: TFunction) => {
        Reflect.defineMetadata(ClassKeys.Children, controllers, target.prototype);
        return target;
    };
}

export function ChildControllers(controllers: Controller | Controller[]): ClassDecorator {

    // tslint:disable-next-line:ban-types
    return <TFunction extends Function>(target: TFunction) => {
        Reflect.defineMetadata(ClassKeys.Children, controllers, target.prototype);
        return target;
    };
}


/***********************************************************************************************
 *                                  Middleware Decorator
 **********************************************************************************************/

export function Middleware(middleware: Middleware | Middleware[]): MethodDecorator {

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
 *                                  Error Middleware Decorator
 **********************************************************************************************/

export function ErrorMiddleware(middleware: ErrorMiddleware): MethodDecorator {

    return (target: any, propertyKey?: string | symbol, descriptor?: PropertyDescriptor) => {
        let routeProperties = Reflect.getOwnMetadata(propertyKey, target);
        if (!routeProperties) {
            routeProperties = {};
        }
        routeProperties = {
            routeErrorMiddleware: middleware,
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

export function Wrapper(wrapperFunction: WrapperFunction) {

    return (target: any, propertyKey: string | symbol, descriptor?: PropertyDescriptor) => {
        let routeProperties = Reflect.getOwnMetadata(propertyKey, target);
        if (!routeProperties) {
            routeProperties = {};
        }
        routeProperties = {
            routeWrapper: wrapperFunction,
            ...routeProperties,
        };
        Reflect.defineMetadata(propertyKey, routeProperties, target);
        if (descriptor) {
            return descriptor;
        }
    };
}

/**
 * Route Decorators for the Overnight web-framework.
 *
 * created by Sean Maxwell Aug 27, 2018
 */

import { Request, Response, NextFunction } from 'express';
import 'reflect-metadata';

type Middlware = (req: Request, res: Response, next: NextFunction) => any;


/***********************************************************************************************
 *                                      Method Decorators
 **********************************************************************************************/

export function Get(path?: string): MethodDecorator {
    return helperForRoutes('get', path);
}


export function Post(path?: string): MethodDecorator {
    return helperForRoutes('post', path);
}


export function Put(path?: string): MethodDecorator {
    return helperForRoutes('put', path);
}


export function Patch(path?: string): MethodDecorator {
    return helperForRoutes('patch', path);
}


export function Delete(path?: string): MethodDecorator {
    return helperForRoutes('delete', path);
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
export const CLASS_MIDDLEWARE_KEY = 'middleware';

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
        Reflect.defineMetadata(CLASS_MIDDLEWARE_KEY, middleware, target.prototype); // pick up here
        return target;
    };
}


/***********************************************************************************************
 *                                  Middleware Decorator
 **********************************************************************************************/




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

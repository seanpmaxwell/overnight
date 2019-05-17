/**
 * Route Decorators for the Overnight web-framework.
 *
 * created by Sean Maxwell Aug 27, 2018
 */

import { Request, Response, NextFunction } from 'express';



/***********************************************************************************************
 *                                            Routes
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


export function Delete(path?: string): MethodDecorator {
    return helperForRoutes('delete', path);
}


function helperForRoutes(httpVerb: string, path?: string): MethodDecorator {

    return (target: any, propertyKey: string | symbol, descriptor?: PropertyDescriptor) => {

        const overnightRouteProperties = { // pull metadata and merge this with it
            httpVerb,
            path: path ? ('/' + path) : '',
        };

        // May not need these two methods, just use metadata and return target[propertyKey]
        if (descriptor) {
            return processMethod(overnightRouteProperties, descriptor);
        } else {
            return processProperty(target, propertyKey, overnightRouteProperties);
        }
    };
}


function processMethod(overnightRouteProperties: {[key: string]: any},
                       descriptor: PropertyDescriptor): PropertyDescriptor {

    const originalMethod = descriptor.value;
    const middleware = originalMethod.middleware || null;
    descriptor.value = function(...args: any[]) {
        return originalMethod.apply(this, args);
    };
    descriptor.value.overnightRouteProperties = {
        ...overnightRouteProperties,
        middleware,
    };
    return descriptor;
}


function processProperty(target: any, propertyKey: string | symbol,
                         overnightRouteProperties: {[key: string]: any}): void {

    const originalMethod = target[propertyKey];
    const middleware = originalMethod.middleware || null;
    target[propertyKey] = function(...args: any[]) {
        return originalMethod.apply(this, args);
    };
    target[propertyKey].overnightRouteProperties = {
        ...overnightRouteProperties,
        middleware,
    };
}


/***********************************************************************************************
 *                                         Middleware
 **********************************************************************************************/

type Middlware = (req: Request, res: Response, next: NextFunction) => any;

// pick up here, need to update this for properties too
export function Middleware(middleware: Middlware | Middlware[]): MethodDecorator {

    return (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor):
            PropertyDescriptor => {

        const originalMethod = descriptor.value;

        descriptor.value = function(...args: any[]) {
            return originalMethod.apply(this, args);
        };

        descriptor.value.middleware = middleware;

        return descriptor;
    };
}

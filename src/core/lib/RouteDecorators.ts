/**
 * Route Decorators for the Overnight web-framework.
 *
 * created by Sean Maxwell Aug 27, 2018
 */

import { Request, Response, NextFunction } from 'express';


/***********************************************************************************************
 *                                            Routes
 **********************************************************************************************/

export function Get(path?: string): MethodDecorator | PropertyDecorator {
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


function helperForRoutes(httpVerb: string, path?: string): MethodDecorator | PropertyDecorator {

    return (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) => {

        const originalMethod = descriptor.value;
        const middleware = originalMethod.middleware || null;

        descriptor.value = function(...args: any[]) {
            return originalMethod.apply(this, args);
        };

        descriptor.value.overnightRouteProperties = {
            httpVerb,
            middleware,
            path: path ? ('/' + path) : '',
        };

        return descriptor;
    };
}


/***********************************************************************************************
 *                                         Middleware
 **********************************************************************************************/

type Middlware = (req: Request, res: Response, next: NextFunction) => any;


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

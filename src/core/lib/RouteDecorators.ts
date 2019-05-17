/**
 * Route Decorators for the Overnight web-framework.
 *
 * created by Sean Maxwell Aug 27, 2018
 */

import { Request, Response, NextFunction } from 'express';
import {BASE_PATH_KEY} from './ClassDecorators';



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
 *                                         Middleware
 **********************************************************************************************/

type Middlware = (req: Request, res: Response, next: NextFunction) => any;

// pick up here, need to update this for properties too
export function Middleware(middleware: Middlware | Middlware[]): MethodDecorator {

    return (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
        let routeProperties = Reflect.getOwnMetadata(propertyKey, target);
        if (!routeProperties) {
            routeProperties = {};
        }
        routeProperties = {
            middleware,
            ...routeProperties,
        };
        Reflect.defineMetadata(propertyKey, routeProperties, target);
        if (descriptor) {
            return descriptor;
        }
    };
}

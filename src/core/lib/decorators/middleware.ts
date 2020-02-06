/**
 * Route Decorators for the Overnight web-framework. Link to all routes for ExpressJS:
 * https://expressjs.com/en/api.html#routing-methods.
 *
 * created by Sean Maxwell Aug 27, 2018
 */

import { Middleware } from './types';

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

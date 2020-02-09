/**
 * Route Decorators for the Overnight web-framework. Link to all routes for ExpressJS:
 * https://expressjs.com/en/api.html#routing-methods.
 *
 * created by Sean Maxwell Aug 27, 2018
 */

import {Middleware, ErrorMiddleware, ClassKeys} from './types';
import * as ReflectHelpers from './reflect-helpers';

export function Middleware(middleware: Middleware | Middleware[]): MethodDecorator {
    return <Function>(target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<Function>) => {
        ReflectHelpers.addToMetadata(target, propertyKey, {routeMiddleware: middleware});
        // For class methods that are not arrow functions
        if (descriptor) {
            return descriptor;
        }
    };
}

export function ErrorMiddleware(middleware: ErrorMiddleware): MethodDecorator {
    return <Function>(target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<Function>) => {
        ReflectHelpers.addToMetadata(target, propertyKey, {routeErrorMiddleware: middleware});
        // For class methods that are not arrow functions
        if (descriptor) {
            return descriptor;
        }
    };
}

export function ClassMiddleware(middleware: Middleware | Middleware[]): ClassDecorator {
    return <TFunction extends Function>(target: TFunction) => {
        Reflect.defineMetadata(ClassKeys.Middleware, middleware, target.prototype);
        return target;
    };
}

export function ClassErrorMiddleware(middleware: ErrorMiddleware | ErrorMiddleware[]): ClassDecorator {
    return <TFunction extends Function>(target: TFunction) => {
        Reflect.defineMetadata(ClassKeys.ErrorMiddleware, middleware, target.prototype);
        return target;
    };
}

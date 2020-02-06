/**
 * Route Decorators for the Overnight web-framework. Link to all routes for ExpressJS:
 * https://expressjs.com/en/api.html#routing-methods.
 *
 * created by Sean Maxwell Aug 27, 2018
 */

import {RouterOptions} from 'express';
import {ErrorMiddleware, Middleware, WrapperFunction, Controller, ClassKeys} from './types';

export function Controller(path: string): ClassDecorator {
    return <TFunction extends Function>(target: TFunction) => {
        Reflect.defineMetadata(ClassKeys.BasePath, '/' + path, target.prototype);
        return target;
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


export function ClassWrapper(wrapperFunction: WrapperFunction): ClassDecorator {
    return <TFunction extends Function>(target: TFunction) => {
        Reflect.defineMetadata(ClassKeys.Wrapper, wrapperFunction, target.prototype);
        return target;
    };
}

export function ClassOptions(options: RouterOptions): ClassDecorator {
    return <TFunction extends Function>(target: TFunction) => {
        Reflect.defineMetadata(ClassKeys.Options, options, target.prototype);
        return target;
    };
}

export function Children(controllers: Controller | Controller[]): ClassDecorator {

    // tslint:disable-next-line: no-console
    console.log('Warning: @Children decorator is deprecated. Use ChildControllers instead.');
    return <TFunction extends Function>(target: TFunction) => {
        Reflect.defineMetadata(ClassKeys.Children, controllers, target.prototype);
        return target;
    };
}

export function ChildControllers(controllers: Controller | Controller[]): ClassDecorator {
    return <TFunction extends Function>(target: TFunction) => {
        Reflect.defineMetadata(ClassKeys.Children, controllers, target.prototype);
        return target;
    };
}


/**
 * Route Decorators for the Overnight web-framework. Link to all routes for ExpressJS:
 * https://expressjs.com/en/api.html#routing-methods.
 *
 * created by Sean Maxwell Aug 27, 2018
 */

import {Middleware, ErrorMiddleware, IMethodMetadata, IClassMetadata, classMetadataKey} from './types';

export function Middleware(middleware: Middleware | Middleware[]): MethodDecorator & PropertyDecorator {
    return (target: Object, propertyKey: string | symbol): void => {
        addMiddlewareToMetadata(target, propertyKey, middleware);
    };
}

// tslint:disable-next-line:max-line-length
export function ErrorMiddleware(errorMiddleware: ErrorMiddleware | ErrorMiddleware[]): MethodDecorator & PropertyDecorator {
    return (target: Object, propertyKey: string | symbol): void => {
        addErrorMiddlewareToMetadata(target, propertyKey, errorMiddleware);
    };
}

export function ClassMiddleware(middleware: Middleware | Middleware[]): ClassDecorator {
    return <TFunction extends Function>(target: TFunction): void => {
        addMiddlewareToMetadata(target.prototype, classMetadataKey, middleware);
    };
}

export function ClassErrorMiddleware(errorMiddleware: ErrorMiddleware | ErrorMiddleware[]): ClassDecorator {
    return <TFunction extends Function>(target: TFunction): void => {
        addErrorMiddlewareToMetadata(target.prototype, classMetadataKey, errorMiddleware);
    };
}

// tslint:disable-next-line:max-line-length
export function addMiddlewareToMetadata(target: Object, metadataKey: any, middlewares: Middleware | Middleware[]): void {
    let metadata: IClassMetadata | IMethodMetadata | undefined = Reflect.getOwnMetadata(metadataKey, target);
    if (!metadata) {
        metadata = {};
    }
    if (!metadata.middlewares) {
        metadata.middlewares = [];
    }
    let newArr: Middleware[];
    if (middlewares instanceof Array) {
        newArr = middlewares.slice();
    } else {
        newArr = [middlewares];
    }
    newArr.push(...metadata.middlewares);
    metadata.middlewares = newArr;
    Reflect.defineMetadata(metadataKey, metadata, target);
}

// tslint:disable-next-line:max-line-length
export function addErrorMiddlewareToMetadata(target: Object, metadataKey: any, errorMiddlewares: ErrorMiddleware | ErrorMiddleware[]): void {
    let metadata: IClassMetadata | IMethodMetadata | undefined = Reflect.getOwnMetadata(metadataKey, target);
    if (!metadata) {
        metadata = {};
    }
    if (!metadata.errorMiddlewares) {
        metadata.errorMiddlewares = [];
    }
    let newArr: ErrorMiddleware[];
    if (errorMiddlewares instanceof Array) {
        newArr = errorMiddlewares.slice();
    } else {
        newArr = [errorMiddlewares];
    }
    newArr.push(...metadata.errorMiddlewares);
    metadata.errorMiddlewares = newArr;
    Reflect.defineMetadata(metadataKey, metadata, target);
}

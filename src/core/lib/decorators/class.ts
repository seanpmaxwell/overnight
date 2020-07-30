/**
 * Route Decorators for the Overnight web-framework. Link to all routes for ExpressJS:
 * https://expressjs.com/en/api.html#routing-methods.
 *
 * created by Sean Maxwell Aug 27, 2018
 */

import {RouterOptions} from 'express';
import {classMetadataKey, Controller, IClassMetadata} from './types';

export function Controller(path: string): ClassDecorator {
    return <TFunction extends Function>(target: TFunction): void => {
        const computedPath: string = path.charAt(0) === '/' ? path : '/' + path;
        addBasePathToClassMetadata(target.prototype, computedPath);
    };
}

export function ClassOptions(options: RouterOptions): ClassDecorator {
    return <TFunction extends Function>(target: TFunction): void => {
        addClassOptionsToClassMetadata(target.prototype, options);
    };
}

export function Children(children: Controller | Controller[]): ClassDecorator {
    // tslint:disable-next-line: no-console
    console.log('Warning: @Children decorator is deprecated. Use ChildControllers instead.');
    return <TFunction extends Function>(target: TFunction): void => {
        addChildControllersToClassMetadata(target.prototype, children);
    };
}

export function ChildControllers(children: Controller | Controller[]): ClassDecorator {
    return <TFunction extends Function>(target: TFunction): void => {
        addChildControllersToClassMetadata(target.prototype, children);
    };
}

export function addBasePathToClassMetadata(target: Object, basePath: string): void {
    let metadata: IClassMetadata | undefined = Reflect.getOwnMetadata(classMetadataKey, target);
    if (!metadata) {
        metadata = {};
    }
    metadata.basePath = basePath;
    Reflect.defineMetadata(classMetadataKey, metadata, target);
}

export function addClassOptionsToClassMetadata(target: Object, options: RouterOptions): void {
    let metadata: IClassMetadata | undefined = Reflect.getOwnMetadata(classMetadataKey, target);
    if (!metadata) {
        metadata = {};
    }
    metadata.options = options;
    Reflect.defineMetadata(classMetadataKey, metadata, target);
}

export function addChildControllersToClassMetadata(target: Object, childControllers: Controller | Controller[]): void {
    let metadata: IClassMetadata | undefined = Reflect.getOwnMetadata(classMetadataKey, target);
    if (!metadata) {
        metadata = {};
    }
    if (!metadata.childControllers) {
        metadata.childControllers = [];
    }
    let newArr: Controller[];
    if (childControllers instanceof Array) {
        newArr = childControllers.slice();
    } else {
        newArr = [childControllers];
    }
    newArr.push(...metadata.childControllers);
    metadata.childControllers = newArr;
    Reflect.defineMetadata(classMetadataKey, metadata, target);
}

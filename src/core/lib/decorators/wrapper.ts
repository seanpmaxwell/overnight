/**
 * Route Decorators for the Overnight web-framework. Link to all routes for ExpressJS:
 * https://expressjs.com/en/api.html#routing-methods.
 *
 * created by Sean Maxwell Aug 27, 2018
 */

import {WrapperFunction} from './types';

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

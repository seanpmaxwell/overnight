/**
 * Route Decorators for the Overnight web-framework. Link to all routes for ExpressJS:
 * https://expressjs.com/en/api.html#routing-methods.
 *
 * created by Sean Maxwell Aug 27, 2018
 */

import {WrapperFunction} from './types';
import * as ReflectHelpers from './reflect-helpers';

export function Wrapper(wrapperFunction: WrapperFunction): MethodDecorator {
    return <Function>(target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<Function>) => {
        ReflectHelpers.addToMetadata(target, propertyKey, {routeWrapper: wrapperFunction});
        if (descriptor) {
            return descriptor;
        }
    };
}

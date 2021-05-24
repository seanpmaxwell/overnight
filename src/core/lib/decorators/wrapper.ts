/**
 * Route Decorators for the Overnight web-framework. Link to all routes for ExpressJS:
 * https://expressjs.com/en/api.html#routing-methods.
 *
 * created by Sean Maxwell Aug 27, 2018
 */

import {classMetadataKey, IClassMetadata, IMethodMetadata, WrapperFunction} from './types';

export function Wrapper(wrapper: WrapperFunction): MethodDecorator & PropertyDecorator {
    return (target: Object, propertyKey: string | symbol): void => {
        addWrapperToMetadata(target, propertyKey, wrapper);
    };
}

export function ClassWrapper(wrapper: WrapperFunction): ClassDecorator {
    return <TFunction extends Function>(target: TFunction): void => {
        addWrapperToMetadata(target.prototype, classMetadataKey, wrapper);
    };
}

export function addWrapperToMetadata(target: Object, metadataKey: any, wrapper: WrapperFunction): void {
    let metadata: IClassMetadata | IMethodMetadata | undefined = Reflect.getOwnMetadata(metadataKey, target);
    if (!metadata) {
        metadata = {};
    }
    metadata.wrapper = wrapper;
    Reflect.defineMetadata(metadataKey, metadata, target);
}

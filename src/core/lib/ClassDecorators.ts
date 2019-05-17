/**
 * Constructor Decorator for the Overnight web-framework.
 *
 * created by Sean Maxwell Aug 26, 2018
 */

import 'reflect-metadata';


export const BASE_PATH_KEY = 'basePath';

export function Controller(path: string): ClassDecorator {

    // tslint:disable-next-line:ban-types
    return <TFunction extends Function>(target: TFunction) => {
        Reflect.defineMetadata(BASE_PATH_KEY, '/' + path, target.prototype);
        return target;
    };
}


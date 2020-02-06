/**
 * Route Decorators for the Overnight web-framework. Link to all routes for ExpressJS:
 * https://expressjs.com/en/api.html#routing-methods.
 *
 * created by Sean Maxwell Aug 27, 2018
 */

import * as ReflectHelpers from './reflect-helpers';

export function Checkout(path?: string | RegExp): MethodDecorator {
    return helperForRoutes('checkout', path);
}

export function Copy(path?: string | RegExp): MethodDecorator {
    return helperForRoutes('copy', path);
}

export function Delete(path?: string | RegExp): MethodDecorator {
    return helperForRoutes('delete', path);
}

export function Get(path?: string | RegExp): MethodDecorator {
    return helperForRoutes('get', path);
}

export function Head(path?: string | RegExp): MethodDecorator {
    return helperForRoutes('head', path);
}

export function Lock(path?: string | RegExp): MethodDecorator {
    return helperForRoutes('lock', path);
}

export function Merge(path?: string | RegExp): MethodDecorator {
    return helperForRoutes('merge', path);
}

export function Mkactivity(path?: string | RegExp): MethodDecorator {
    return helperForRoutes('mkactivity', path);
}

export function Mkcol(path?: string | RegExp): MethodDecorator {
    return helperForRoutes('mkcol', path);
}

export function Move(path?: string | RegExp): MethodDecorator {
    return helperForRoutes('move', path);
}

export function MSearch(path?: string | RegExp): MethodDecorator {
    return helperForRoutes('m-search', path);
}

export function Notify(path?: string | RegExp): MethodDecorator {
    return helperForRoutes('notify', path);
}

export function Options(path?: string | RegExp): MethodDecorator {
    return helperForRoutes('options', path);
}

export function Patch(path?: string | RegExp): MethodDecorator {
    return helperForRoutes('patch', path);
}

export function Post(path?: string | RegExp): MethodDecorator {
    return helperForRoutes('post', path);
}

export function Purge(path?: string | RegExp): MethodDecorator {
    return helperForRoutes('purge', path);
}

export function Put(path?: string | RegExp): MethodDecorator {
    return helperForRoutes('put', path);
}

export function Report(path?: string | RegExp): MethodDecorator {
    return helperForRoutes('report', path);
}

export function Search(path?: string | RegExp): MethodDecorator {
    return helperForRoutes('search', path);
}

export function Subscribe(path?: string | RegExp): MethodDecorator {
    return helperForRoutes('subscribe', path);
}

export function Trace(path?: string | RegExp): MethodDecorator {
    return helperForRoutes('trace', path);
}

export function Unlock(path?: string | RegExp): MethodDecorator {
    return helperForRoutes('unlock', path);
}

export function Unsubscribe(path?: string | RegExp): MethodDecorator {
    return helperForRoutes('unsubscribe', path);
}

function helperForRoutes(httpVerb: string, path?: string | RegExp): MethodDecorator {

    // tslint:disable-next-line:ban-types
    return <Function>(target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<Function>) => {
        let newPath: string | RegExp;
        if (path === undefined) {
            newPath = '';
        } else if (path instanceof RegExp) {
            if (path.toString().charAt(1) === '^') {
                //  /^api$/ -> //api$/
                newPath = new RegExp('/' + path.toString().slice(2).replace(/\/$/, ''));
            } else {
                //  /api/ -> //.*api/
                newPath = new RegExp('/.*' + path.toString().slice(1).replace(/\/$/, ''));
            }
        } else {
            // path is a string
            newPath = '/' + path;
        }
        ReflectHelpers.addToMetadata(target, propertyKey, {
            httpVerb,
            path: newPath,
        });
        if (descriptor) {
            return descriptor;
        }
    };
}

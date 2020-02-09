/**
 * Route Decorators for the Overnight web-framework. Link to all routes for ExpressJS:
 * https://expressjs.com/en/api.html#routing-methods.
 *
 * created by Sean Maxwell Aug 27, 2018
 */

import * as ReflectHelpers from './reflect-helpers';
import {HttpVerb} from './types';


export function All(path?: string | RegExp): MethodDecorator & PropertyDecorator {
    return helperForRoutes('all', path);
}

export function Checkout(path?: string | RegExp): MethodDecorator & PropertyDecorator {
    return helperForRoutes(HttpVerb.CHECKOUT, path);
}

export function Copy(path?: string | RegExp): MethodDecorator & PropertyDecorator {
    return helperForRoutes(HttpVerb.COPY, path);
}

export function Delete(path?: string | RegExp): MethodDecorator & PropertyDecorator {
    return helperForRoutes(HttpVerb.DELETE, path);
}

export function Get(path?: string | RegExp): MethodDecorator & PropertyDecorator {
    return helperForRoutes(HttpVerb.GET, path);
}

export function Head(path?: string | RegExp): MethodDecorator & PropertyDecorator {
    return helperForRoutes(HttpVerb.HEAD, path);
}

export function Lock(path?: string | RegExp): MethodDecorator & PropertyDecorator {
    return helperForRoutes(HttpVerb.LOCK, path);
}

export function Merge(path?: string | RegExp): MethodDecorator & PropertyDecorator {
    return helperForRoutes(HttpVerb.MERGE, path);
}

export function Mkactivity(path?: string | RegExp): MethodDecorator & PropertyDecorator {
    return helperForRoutes(HttpVerb.MKACTIVITY, path);
}

export function Mkcol(path?: string | RegExp): MethodDecorator & PropertyDecorator {
    return helperForRoutes(HttpVerb.MKCOL, path);
}

export function Move(path?: string | RegExp): MethodDecorator & PropertyDecorator {
    return helperForRoutes(HttpVerb.MOVE, path);
}

export function MSearch(path?: string | RegExp): MethodDecorator & PropertyDecorator {
    return helperForRoutes(HttpVerb.MSEARCH, path);
}

export function Notify(path?: string | RegExp): MethodDecorator & PropertyDecorator {
    return helperForRoutes(HttpVerb.NOTIFY, path);
}

export function Options(path?: string | RegExp): MethodDecorator & PropertyDecorator {
    return helperForRoutes(HttpVerb.OPTIONS, path);
}

export function Patch(path?: string | RegExp): MethodDecorator & PropertyDecorator {
    return helperForRoutes(HttpVerb.PATCH, path);
}

export function Post(path?: string | RegExp): MethodDecorator & PropertyDecorator {
    return helperForRoutes(HttpVerb.POST, path);
}

export function Purge(path?: string | RegExp): MethodDecorator & PropertyDecorator {
    return helperForRoutes(HttpVerb.PURGE, path);
}

export function Put(path?: string | RegExp): MethodDecorator & PropertyDecorator {
    return helperForRoutes(HttpVerb.PUT, path);
}

export function Report(path?: string | RegExp): MethodDecorator & PropertyDecorator {
    return helperForRoutes(HttpVerb.REPORT, path);
}

export function Search(path?: string | RegExp): MethodDecorator & PropertyDecorator {
    return helperForRoutes(HttpVerb.SEARCH, path);
}

export function Subscribe(path?: string | RegExp): MethodDecorator & PropertyDecorator {
    return helperForRoutes(HttpVerb.SUBSCRIBE, path);
}

export function Trace(path?: string | RegExp): MethodDecorator & PropertyDecorator {
    return helperForRoutes(HttpVerb.TRACE, path);
}

export function Unlock(path?: string | RegExp): MethodDecorator & PropertyDecorator {
    return helperForRoutes(HttpVerb.UNLOCK, path);
}

export function Unsubscribe(path?: string | RegExp): MethodDecorator & PropertyDecorator {
    return helperForRoutes(HttpVerb.UNSUBSCRIBE, path);
}

function helperForRoutes(httpVerb: HttpVerb | 'all', path?: string | RegExp): MethodDecorator & PropertyDecorator {
    return <Function>(target: Object, propertyKey: string | symbol, descriptor?: TypedPropertyDescriptor<Function>) => {
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

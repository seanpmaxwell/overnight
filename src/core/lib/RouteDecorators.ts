/**
 * Route Decorators for the Overnight web-framework.
 *
 * created by Sean Maxwell Aug 27, 2018
 */



/***********************************************************************************************
 *                                            Routes
 **********************************************************************************************/

export function Get(path?: string): MethodDecorator {
    return helperForRoutes('get', path);
}

export function Post(path?: string): MethodDecorator {
    return helperForRoutes('post', path);
}

export function Put(path?: string): MethodDecorator {
    return helperForRoutes('put', path);
}

export function Delete(path?: string): MethodDecorator {
    return helperForRoutes('delete', path);
}

function helperForRoutes(httpVerb: string, path?: string): MethodDecorator {

    return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {

        const originalMethod = descriptor.value;
        const middleware = originalMethod.middleware || null;

        descriptor.value = function(...args: any[]) {
            return originalMethod.apply(this, args);
        };

        descriptor.value.overnightRouteProperties = {
            httpVerb: httpVerb,
            path: path ? ('/' + path) : '',
            middleware: middleware
        };

        return descriptor;
    }
}


/***********************************************************************************************
 *                                         Middleware
 **********************************************************************************************/

export function Middleware(middleware: Function | Function[]): MethodDecorator {

    return function(target: any, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor {

        const originalMethod = descriptor.value;

        descriptor.value = function(...args: any[]) {
            return originalMethod.apply(this, args);
        };

        descriptor.value.middleware = middleware;

        return descriptor;
    }
}

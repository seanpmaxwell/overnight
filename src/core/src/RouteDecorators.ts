/**
 * Route Decorators for the Overnight web-framework.
 *
 * created by Sean Maxwell Aug 27, 2018
 */



/***********************************************************************************************
 *                                            Routes
 **********************************************************************************************/

export function Get(path?: string): MethodDecorator
{
    return helperForRoutes('GET', path)
}

export function Post(path?: string): MethodDecorator
{
    return helperForRoutes('POST', path)
}

export function Put(path?: string): MethodDecorator
{
    return helperForRoutes('PUT', path)
}

export function Delete(path?: string): MethodDecorator
{
    return helperForRoutes('DELETE', path)
}

function helperForRoutes(call: string, path?: string): MethodDecorator
{
    return function(target: any, propertyKey: string, descriptor: PropertyDescriptor)
    {
        const originalMethod = descriptor.value

        descriptor.value = function(...args: any[])
        {
            return originalMethod.apply(this, args)
        }

        // Set the HTTP call type and Path
        descriptor.value.onProperties = {
            call: call,
            path: path ? ('/' + path) : ''
        }

        return descriptor
    }
}


/***********************************************************************************************
 *                                         Middleware
 **********************************************************************************************/

// pick up here, get rid of options keyword, options is the middleware,
export function Middleware(middleware: Function): MethodDecorator
{
    return function(target: any, propertyKey: string, descriptor: PropertyDescriptor)
    {
        // Middleware must be a function
        if(!(middleware instanceof Function)) {
            throw Error('middle must be an instance of function')
            return descriptor.value
        }

        // Save the scope
        const originalMethod = descriptor.value

        descriptor.value = function(...args: any[]) {
            return originalMethod.apply(this, args)
        }

        // Set the middleware
        if(descriptor.value.onProperties) {
            descriptor.value.onProperties.middleware = middleware
        }
        else {
            throw new Error('Middleware passed without route being defined')
        }

        return descriptor
    }
}

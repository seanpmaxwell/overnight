/**
 * Route Decorators for the Overnight web-framework.
 *
 * created by Sean Maxwell Aug 27, 2018
 */

export function Get(path?: string, options?: any)
{
    return helperDec('GET', path, options)
}

export function Post(path?: string, options?: any)
{
    return helperDec('POST', path, options)
}

export function Put(path?: string, options?: any)
{
    return helperDec('PUT', path, options)
}

export function Delete(path?: string, options?: any)
{
    return helperDec('DELETE', path, options)
}

function helperDec(call: string, path?: string, options?: any)
{
    path = path ? ('/' + path) : ''

    return function(target: any, propertyKey: string, descriptor: PropertyDescriptor)
    {
        const originalMethod = descriptor.value

        descriptor.value = {
            isOvernightRoute: true,
            call: call,
            path: path,
            options: options,
            method: originalMethod
        }

        return descriptor
    }
}

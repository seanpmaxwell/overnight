/**
 * Route Decorators for the Overnight web-framework.
 *
 * created by Sean Maxwell Aug 27, 2018
 */

export function Get(path?: string, options?: any): MethodDecorator
{
    return helperDec('GET', path, options)
}

export function Post(path?: string, options?: any): MethodDecorator
{
    return helperDec('POST', path, options)
}

export function Put(path?: string, options?: any): MethodDecorator
{
    return helperDec('PUT', path, options)
}

export function Delete(path?: string, options?: any): MethodDecorator
{
    return helperDec('DELETE', path, options)
}

function helperDec(call: string, path?: string, options?: any): MethodDecorator
{
    path = path ? ('/' + path) : ''

    return function(target: any, propertyKey: string, descriptor: PropertyDescriptor)
    {
        const originalMethod = descriptor.value

        descriptor.value = function(...args: any[])
        {
            return originalMethod.apply(this, args)
        }

        descriptor.value.onProperties = {
            call: call,
            path: path,
            options: options
        }

        return descriptor
    }
}

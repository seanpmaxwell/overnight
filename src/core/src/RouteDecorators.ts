/**
 * Route Decorators for the Overnight web-framework.
 *
 * created by Sean Maxwell Aug 27, 2018
 */

// Each method decorator will transform the function to a prototype
// prototype will have {Method, route, middleware, callback(the logic) )
// controller needs to loop through array of protoypes

export function Get(path: string, middleware?: Array<any>)
{
    return helperDec('GET', path, middleware)
}

function helperDec(call: string, path: string, middleware?: Array<any>)
{
    return function(target: any, propertyKey: string, descriptor: PropertyDescriptor)
    {
        const originalMethod = descriptor.value

        let prototype = {
            call: call,
            path: path,
            middleware: middleware,
            method: originalMethod
        }

        descriptor.value = prototype
        return descriptor
    }
}



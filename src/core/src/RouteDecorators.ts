/**
 * Route Decorators for the Overnight web-framework.
 *
 * created by Sean Maxwell Aug 27, 2018
 */

export function Get(path?: string, options?: any): MethodDecorator
{
    // return helperDec('GET', path, options)

    path = path ? ('/' + path) : ''

    return function(target: any, propertyKey: string, descriptor: PropertyDescriptor)
    {
        const originalMethod = descriptor.value

        // NOTE: Do not use arrow syntax here. Use a function expression in
        // order to use the correct value of `this` in this method (see notes below)
        descriptor.value = function(...args: any[])
        {
            // pre
            console.log("The method args are: " + args.length);

            // run and store result
            const result = originalMethod.apply(this, args);

            // post
            console.log("The return value is: " + result);

            // return the result of the original method (or modify it before returning)
            return result;
        };

        descriptor.value.overnightProperties = {
            call: 'GET',
            path: path,
            options: options
        }

        return descriptor
    }
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

    return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value


        // NOTE: Do not use arrow syntax here. Use a function expression in
        // order to use the correct value of `this` in this method (see notes below)
        descriptor.value = function(...args: any[])
        {
            // pre
            // console.log("The method args are: " + JSON.stringify(args));

            // run and store result
            const result = originalMethod.apply(this, args);

            // post
            // console.log("The return value is: " + result);

            // return the result of the original method (or modify it before returning)
            return result;
        };

        descriptor.value.overnightProperties = {
            call: call,
            path: path,
            options: options
        }

        return descriptor
    }
}

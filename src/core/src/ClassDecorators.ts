/**
 * Constructor Decorator for the Overnight web-framework.
 *
 * created by Sean Maxwell Aug 26, 2018
 */


export function Controller<T extends {new (...args: any[]): any}>(path: string)
{
    return function(constr: T)
    {
        return class extends constr
        {
            basePath = '/' + path
        }
    }
}

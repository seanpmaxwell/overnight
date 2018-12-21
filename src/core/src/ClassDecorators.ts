/**
 * Constructor Decorator for the Overnight web-framework.
 *
 * created by Sean Maxwell Aug 26, 2018
 */


export function Controller(path: string)
{
    return function<T extends {new (...args: any[]): {}}>(constructor: T)
    {
        return class extends constructor
        {
            controllerBasePath = '/' + path;
        }
    }
}

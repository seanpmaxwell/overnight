/**
 * Constructor Decorator for the Overnight web-framework.
 *
 * created by Sean Maxwell Aug 26, 2018
 */


export function Dao<T extends {new (...args: any[]): {}}>(constr: T)
{
    // Change name from UserDao to userDao_
    let name = constr.name
    name = name.charAt(0).toUpperCase() + name.slice(1) + '_'

    return class extends constr
    {
        daoAttrName = name
    }
}


export function Controller<T extends {new (...args: any[]): any}>(path: string)
{
    return function(constr: T)
    {
        return class extends constr
        {
            onBasePath = '/' + path
        }
    }
}

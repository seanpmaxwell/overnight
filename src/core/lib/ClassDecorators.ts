/**
 * Constructor Decorator for the Overnight web-framework.
 *
 * created by Sean Maxwell Aug 26, 2018
 */


export function Controller(path: string) {

    return (target: new () => any) => {

        Object.defineProperty(target.prototype, 'controllerBasePath', {
            configurable: true,
            enumerable: true,
            value: '/' + path,
            writable: false,
        });

        return target;
    };
}


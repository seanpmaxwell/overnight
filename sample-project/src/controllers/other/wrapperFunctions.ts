/**
 * Asynchronous wrapper for practicing wrapper decorator.
 * https://github.com/seanpmaxwell/overnight/issues/9
 *
 * created by Sean Maxwell 5/28/2019
 */

import { Request, Response, NextFunction } from 'express';

// Callback type
type ExpressCallback = (request: Request, response: Response, next?: NextFunction) => any;



// Wrapper Function
export const asyncWrapper = (action: ExpressCallback) => {

    return (req: Request, res: Response, next?: NextFunction) => {
        const fnReturn = action(req, res, next);
        return Promise.resolve(fnReturn).catch(next);
    }
};


// Wrapper Function
export const genericWrapper = (action: ExpressCallback) => {

    return (req: Request, res: Response, next?: NextFunction) => {
        return action(req, res, next);
    }
};

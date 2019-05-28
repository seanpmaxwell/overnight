/**
 * Asynchronous wrapper for practicing wrapper decorator.
 * https://github.com/seanpmaxwell/overnight/issues/9
 *
 * created by Sean Maxwell 5/28/2019
 */

import { RequestHandler, Request, Response, NextFunction } from 'express';



// Wrapper Function
export const asyncWrapper = (action: RequestHandler) => {

    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            return await action(req, res, next);
        } catch (error) {
            next(error);
        }
    }
};


// Wrapper Function
export const genericWrapper = (action: RequestHandler) => {

    return (req: Request, res: Response, next: NextFunction) => {
        return action(req, res, next);
    }
};


// Wait some time, 1 to 500 milliseconds
export const asyncFunction = (fail?: boolean) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            fail ? reject('Method failed') : resolve('Method passed');
        }, Math.floor(Math.random() * 500) + 1);
    });
};

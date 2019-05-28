/**
 * Asynchronous wrapper for practicing wrapper decorator.
 * https://github.com/seanpmaxwell/overnight/issues/9
 *
 * created by Sean Maxwell 5/28/2019
 */

import { Request, Response, NextFunction } from 'express';

type ExpressCallback = (request: Request, response: Response, next?: NextFunction) => any;


export const asyncWrapper = (action: ExpressCallback) => {

    try {
        return await action(request, response, next);
    } catch (error) {
        next(error);
    }
};

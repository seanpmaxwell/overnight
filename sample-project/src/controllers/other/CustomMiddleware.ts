/**
 * Simple middleware to be used for development.
 *
 * created by Sean Maxwell, 5/23/2019
 */

import { Request, Response, NextFunction } from 'express';


export function sayHello(req: Request, res: Response, next: NextFunction) {
    // tslint:disable-next-line:no-console
    console.log('Hello OvernightJS! ' + req.method + ' ' + req.originalUrl);
    next();
}

export function sayGoodbye(req: Request, res: Response, next: NextFunction) {
    // tslint:disable-next-line:no-console
    console.log('Goodbye OvernightJS! ' + req.method + ' ' + req.originalUrl);
    next();
}

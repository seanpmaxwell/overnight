/**
 * Simple error middleware to be used for development.
 *
 * created by Wekoslav Stefanovski, 1/4/2020
 */

import { INTERNAL_SERVER_ERROR } from 'http-status-codes';
import { Request, Response, NextFunction } from 'express';


export function logErrorAndStop(error: Error, req: Request, res: Response, next: NextFunction) {
    // tslint:disable-next-line:no-console
    console.log('Error occured in the controller class ', error.message);
    // tslint:disable-next-line:no-console
    console.log('Stopping request processing');
    res.status(INTERNAL_SERVER_ERROR).json({ message: 'Internal server error', route: req.originalUrl });
}

export function logErrorAndContinue(error: Error, req: Request, res: Response, next: NextFunction) {
    // tslint:disable-next-line:no-console
    console.log('Error occured in the request', error.message);
    // tslint:disable-next-line:no-console
    console.log('Continuing with request processing');
    next(error);
}

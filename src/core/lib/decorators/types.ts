/**
 * Route Decorators for the Overnight web-framework. Link to all routes for ExpressJS:
 * https://expressjs.com/en/api.html#routing-methods.
 *
 * created by Sean Maxwell Aug 27, 2018
 */

import { RequestHandler, ErrorRequestHandler } from 'express';

// Types
export type Middleware = RequestHandler;
export type ErrorMiddleware = ErrorRequestHandler;
export type WrapperFunction = ((action: any) => any);
export type Controller = InstanceType<any>;

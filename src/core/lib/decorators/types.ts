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

export enum ClassKeys {
    BasePath = 'BASE_PATH',
    Middleware = 'MIDDLEWARE',
    ErrorMiddleware = 'ERROR_MIDDLEWARE',
    Wrapper = 'WRAPPER',
    Children = 'CHILDREN',
    Options = 'OPTIONS',
}

export enum HttpVerb {
    CHECKOUT = 'checkout',
    COPY = 'copy',
    DELETE = 'delete',
    GET = 'get',
    HEAD = 'head',
    LOCK = 'lock',
    MERGE = 'merge',
    MKACTIVITY = 'mkactivity',
    MKCOL = 'mkcol',
    MOVE = 'move',
    MSEARCH = 'm-search',
    NOTIFY = 'notify',
    OPTIONS = 'options',
    PATCH = 'patch',
    POST = 'post',
    PURGE = 'purge',
    PUT = 'put',
    REPORT = 'report',
    SEARCH = 'search',
    SUBSCRIBE = 'subscribe',
    TRACE = 'trace',
    UNLOCK = 'unlock',
    UNSUBSCRIBE = 'unsubscribe',
}

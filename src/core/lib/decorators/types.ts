/**
 * Route Decorators for the Overnight web-framework. Link to all routes for ExpressJS:
 * https://expressjs.com/en/api.html#routing-methods.
 *
 * created by Sean Maxwell Aug 27, 2018
 */

import {RequestHandler, ErrorRequestHandler, IRouter, RouterOptions} from 'express';
import {PathParams} from 'express-serve-static-core';

export type Middleware = RequestHandler;
export type ErrorMiddleware = ErrorRequestHandler;
export type WrapperFunction = ((methodOrProperty: any) => RequestHandler);
export type Controller = any;
export type RouterLib = ((options?: RouterOptions) => IRouter);

export interface IMethodMetadata {
    httpRoutes?: IHttpRoute[];
    errorMiddlewares?: ErrorMiddleware[];
    middlewares?: Middleware[];
    wrapper?: WrapperFunction;
}

export interface IClassMetadata {
    basePath?: PathParams;
    childControllers?: Controller[];
    errorMiddlewares?: ErrorMiddleware[];
    middlewares?: Middleware[];
    options?: RouterOptions;
    wrapper?: WrapperFunction;
}

export const classMetadataKey: symbol = Symbol('Class Metadata Key');

export type HttpDecorator = HttpVerb | 'all';
export interface IHttpRoute {
    httpDecorator: HttpDecorator;
    path: string | RegExp;
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
